import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, OnDestroy {
  user: any;
  parkingForm: FormGroup;
  statusParkir: any = {};
  checkinButton = false;
  exitGate: string = '';

  elapsedTime = '00:00:00';
  estimatedCost: number = 0;
  parkingArea: string = '';
  private intervalId: any;

  constructor(
    private title: Title,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    this.title.setTitle('Dashboard');
    this.user = localStorage.getItem('user') || 'Pengguna';

    this.parkingForm = this.fb.group({
      type: ['', Validators.required],
      checkin: [''],
      checkout: [''],
      area: ['']
    });
  }

  ngOnInit(): void {
    const status = localStorage.getItem('parkirstatus');

    if (status) {
      try {
        this.statusParkir = JSON.parse(status);
        const checkInDate = new Date(this.statusParkir?.checkIn);

        // Ambil lokasi area parkir
        this.parkingArea = this.statusParkir?.area || '';

        if (!isNaN(checkInDate.getTime())) {
          this.checkinButton = false;
          this.startTimer(checkInDate);
        } else {
          this.checkinButton = true;
        }
      } catch (e) {
        console.error('Gagal parse parkirstatus:', e);
        this.checkinButton = true;
      }
    } else {
      this.checkinButton = true;
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  checkInPark() {
    const type = this.parkingForm.value.type;
    let area = '';

    // Tentukan area berdasarkan tipe kendaraan
    if (type === 'motor') {
      area = 'Lantai 1';
    } else if (type === 'mobil' || type === 'bus') {
      area = 'Lantai 2 atau 3';
    }

    const newData = {
      checkIn: new Date().toISOString(),
      type,
      area,
    };

    localStorage.setItem('parkirstatus', JSON.stringify(newData));
    this.statusParkir = newData;
    this.parkingArea = area;
    this.checkinButton = false;
    this.startTimer(new Date(newData.checkIn));
  }

  startTimer(checkIn: Date) {
    this.stopTimer();

    this.intervalId = setInterval(() => {
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - checkIn.getTime()) / 1000);
      const formatted = this.formatTime(diffSec);
      this.elapsedTime = formatted;

      // Hitung biaya berdasarkan jam
      const durationHours = Math.ceil(diffSec / 3600);

      let rate = 0;
      const vehicleType = this.statusParkir?.type;

      if (vehicleType === 'motor') {
        rate = 2000;
      } else if (vehicleType === 'mobil') {
        rate = 4000;
      } else if (vehicleType === 'bus') {
        rate = 6000;
      }

      this.estimatedCost = durationHours * rate;

      this.cd.detectChanges(); // Pastikan UI update
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private formatTime(totalSeconds: number): string {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  checkout() {
    // Simulasikan logika keluar
    console.log('Checkout berhasil lewat', this.exitGate);

    // Reset semua data
    this.stopTimer();
    localStorage.removeItem('parkirstatus');
    this.statusParkir = {};
    this.checkinButton = true;
    this.elapsedTime = '00:00:00';
    this.estimatedCost = 0;
    this.exitGate = '';

    // Tutup modal secara manual
    const modalElement = document.getElementById('checkoutModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }

  logout() {
    this.stopTimer();
    localStorage.removeItem('parkirstatus');
    this.auth.logout();
    this.router.navigate(['./login']);
  }
}