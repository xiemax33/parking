const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Dummy Auth
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    return res.json({ token: "dummy-token" });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

// Parkir Slot Model Simulasi
let parkingData = {
  floors: [
    { floor: 1, type: "motor", slots: new Array(8).fill(0) },
    { floor: 2, type: "mobil", slots: new Array(8).fill(0) },
    { floor: 3, type: "mobil", slots: new Array(8).fill(0) },
  ],
};

// Harga
const prices = { motor: 2000, mobil: 4000, bus: 6000 };

// Cek slot tersedia
function findSlot(vehicle) {
  if (vehicle === "motor") {
    const floor = parkingData.floors[0];
    for (let i = 0; i < floor.slots.length; i++) {
      if (floor.slots[i] < 4) return { floor: 1, slot: i };
    }
  } else if (vehicle === "mobil") {
    for (let floorIdx = 1; floorIdx <= 2; floorIdx++) {
      const floor = parkingData.floors[floorIdx];
      for (let i = 0; i < floor.slots.length; i++) {
        if (floor.slots[i] === 0) return { floor: floor.floor, slot: i };
      }
    }
  } else if (vehicle === "bus") {
    for (let floorIdx = 1; floorIdx <= 2; floorIdx++) {
      const floor = parkingData.floors[floorIdx];
      for (let i = 0; i <= floor.slots.length - 4; i++) {
        if (floor.slots.slice(i, i + 4).every((s) => s === 0)) {
          return { floor: floor.floor, slot: i };
        }
      }
    }
  }
  return null;
}

// Parkir Masuk
app.post("/park", (req, res) => {
  const { vehicle, duration } = req.body;
  const slotInfo = findSlot(vehicle);
  if (!slotInfo) return res.status(400).json({ message: "Slot penuh" });

  const floor = parkingData.floors[slotInfo.floor - 1];

  if (vehicle === "motor") floor.slots[slotInfo.slot]++;
  else if (vehicle === "mobil") floor.slots[slotInfo.slot] = 1;
  else if (vehicle === "bus") for (let i = 0; i < 4; i++) floor.slots[slotInfo.slot + i] = 1;

  const cost = prices[vehicle] * duration;
  res.json({ message: `Parkir ${vehicle} berhasil di lantai ${slotInfo.floor}, slot ${slotInfo.slot}`, biaya: cost });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
