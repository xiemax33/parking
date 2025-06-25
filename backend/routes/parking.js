const express = require('express');
const router = express.Router();

const RATES = {
  motor: 2000,
  mobil: 4000,
  bus: 6000,
};

const PARKING_CAPACITY = {
  lantai1: { slot: 8, type: 'motor' },
  lantai2: { slot: 8, type: 'mobil_bus' },
  lantai3: { slot: 8, type: 'mobil_bus' },
};

let parkingData = [];

router.post('/masuk', (req, res) => {
  const { vehicleType, durationHours } = req.body;
  let slotUsed = 0;

  if (vehicleType === 'motor') slotUsed = 1 / 4;
  if (vehicleType === 'mobil') slotUsed = 1;
  if (vehicleType === 'bus') slotUsed = 4;

  const availableFloor = Object.keys(PARKING_CAPACITY).find(floor => {
    const floorData = parkingData.filter(p => p.floor === floor);
    const used = floorData.reduce((acc, cur) => acc + cur.slotUsed, 0);
    return (PARKING_CAPACITY[floor].type.includes(vehicleType)) && (used + slotUsed <= PARKING_CAPACITY[floor].slot);
  });

  if (!availableFloor) return res.status(400).json({ message: 'No available slot' });

  const totalCost = durationHours * RATES[vehicleType];
  const ticket = {
    id: Date.now(),
    floor: availableFloor,
    vehicleType,
    slotUsed,
    durationHours,
    totalCost,
    masuk: new Date().toISOString(),
  };
  parkingData.push(ticket);
  res.json(ticket);
});

router.get('/data', (req, res) => {
  res.json(parkingData);
});

module.exports = router;