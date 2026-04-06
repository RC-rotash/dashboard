"use client";

import { useState, useMemo } from "react";
import { Download, TrendingUp, TrendingDown, Calendar } from "lucide-react";

// ==================== DATA STRUCTURES ====================
interface ChargerData {
  sno: number;
  liveDate: string;
  name: string;
  percentChange: number | string;
  duration: string;
  amount: number;
  units: number;
  prevDuration: string;
  prevAmount: number;
  prevUnits: number;
  mtdAmount: number;
  mtdUnits: number;
  avgAmountPerDay: number;
  avgUnitsPerDay: number;
}

// ---------- 1. Stand‑Alone DC Chargers ----------
const standAloneDCData: ChargerData[] = [
  { sno: 1, liveDate: "01-Jan-25", name: "KW Delhi 6 Mall RC 60kW DC", percentChange: -49, duration: "6:49:12", amount: 4637, units: 221, prevDuration: "13:47:54", prevAmount: 9110, prevUnits: 434, mtdAmount: 174478, mtdUnits: 8310, avgAmountPerDay: 5628, avgUnitsPerDay: 268 },
  { sno: 2, liveDate: "14-Aug-25", name: "Bhairon Marg RC 60kW DC", percentChange: -37, duration: "2:34:40", amount: 1705, units: 96, prevDuration: "6:06:41", prevAmount: 2671, prevUnits: 152, mtdAmount: 38876, mtdUnits: 2180, avgAmountPerDay: 1254, avgUnitsPerDay: 70 },
  { sno: 3, liveDate: "29-Aug-25", name: "Titagarh RC 60KW DC", percentChange: -48, duration: "0:41:53", amount: 182, units: 12, prevDuration: "1:31:11", prevAmount: 347, prevUnits: 23, mtdAmount: 3149, mtdUnits: 210, avgAmountPerDay: 102, avgUnitsPerDay: 7 },
  { sno: 4, liveDate: "04-Oct-25", name: "CGO Complex RC 60kW DC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 5, liveDate: "19-Oct-25", name: "Airport road RC 60 kW DC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 6, liveDate: "19-Oct-25", name: "Munirka Near Udupi RC 60kW DC", percentChange: 16, duration: "2:09:16", amount: 1619, units: 90, prevDuration: "1:31:53", prevAmount: 1390, prevUnits: 77, mtdAmount: 32058, mtdUnits: 1781, avgAmountPerDay: 1034, avgUnitsPerDay: 57 },
  { sno: 7, liveDate: "06-Nov-25", name: "Rajokri RC 60kW DC", percentChange: -30, duration: "1:12:10", amount: 644, units: 32, prevDuration: "1:01:50", prevAmount: 586, prevUnits: 46, mtdAmount: 29714, mtdUnits: 1558, avgAmountPerDay: 959, avgUnitsPerDay: 50 },
  { sno: 8, liveDate: "12-Dec-25", name: "DDA Shopping complex Rajdhani Enclave RC 60kW DC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:51:11", prevAmount: 690, prevUnits: 38, mtdAmount: 19078, mtdUnits: 1074, avgAmountPerDay: 615, avgUnitsPerDay: 35 },
  { sno: 9, liveDate: "12-Dec-25", name: "MCD Parking near Lakshmi Nagar metro RC 60kW DC", percentChange: -16, duration: "1:00:26", amount: 612, units: 48, prevDuration: "1:19:17", prevAmount: 1027, prevUnits: 57, mtdAmount: 21889, mtdUnits: 1286, avgAmountPerDay: 706, avgUnitsPerDay: 41 },
  { sno: 10, liveDate: "30-Dec-25", name: "Noida Sector 2 RC 60 kW DC", percentChange: -28, duration: "11:38:04", amount: 2611, units: 172, prevDuration: "9:20:58", prevAmount: 3463, prevUnits: 238, mtdAmount: 74778, mtdUnits: 4835, avgAmountPerDay: 2412, avgUnitsPerDay: 156 },
  { sno: 11, liveDate: "30-Dec-25", name: "MCD Parking West ganesh nagar chowk 60 kW DC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 12, liveDate: "29-Jan-26", name: "MCD Parking Parmanand hospital West Vinod Nagar 60kW DC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:28:52", prevAmount: 358, prevUnits: 20, mtdAmount: 2919, mtdUnits: 163, avgAmountPerDay: 94, avgUnitsPerDay: 5 },
  { sno: 13, liveDate: "28-Feb-26", name: "Parx Laureate RC 60kW DC", percentChange: "#DIV/0!", duration: "0:28:35", amount: 239, units: 17, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 13169, mtdUnits: 941, avgAmountPerDay: 425, avgUnitsPerDay: 30 },
  { sno: 14, liveDate: "28-Feb-26", name: "KW Blue Pearl Karol Bagh RC 60kW DC", percentChange: 78, duration: "0:49:05", amount: 462, units: 22, prevDuration: "0:14:02", prevAmount: 259, prevUnits: 12, mtdAmount: 6771, mtdUnits: 322, avgAmountPerDay: 218, avgUnitsPerDay: 10 },
  { sno: 15, liveDate: "06-Mar-26", name: "Ayodhya Enclave Rohini RC 60kW DC", percentChange: 103, duration: "1:11:35", amount: 663, units: 33, prevDuration: "0:57:00", prevAmount: 326, prevUnits: 16, mtdAmount: 11030, mtdUnits: 552, avgAmountPerDay: 356, avgUnitsPerDay: 18 },
  { sno: 16, liveDate: "06-Mar-26", name: "MCD Parking Star City mall RC 60kW DC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 1961, mtdUnits: 117, avgAmountPerDay: 63, avgUnitsPerDay: 4 },
  { sno: 17, liveDate: "07-Mar-26", name: "Gardenia Glory RC 60kW DC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:22:33", prevAmount: 117, prevUnits: 6, mtdAmount: 10950, mtdUnits: 547, avgAmountPerDay: 353, avgUnitsPerDay: 18 },
  { sno: 18, liveDate: "14-Mar-26", name: "ATS Greens Paradiso RC 120kW DC", percentChange: -26, duration: "2:30:44", amount: 918, units: 73, prevDuration: "3:31:54", prevAmount: 1246, prevUnits: 100, mtdAmount: 8561, mtdUnits: 654, avgAmountPerDay: 276, avgUnitsPerDay: 21 },
  { sno: 19, liveDate: "14-Mar-26", name: "ATS Pristine RC 60kW DC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 1757, mtdUnits: 117, avgAmountPerDay: 57, avgUnitsPerDay: 4 },
  { sno: 20, liveDate: "25-Mar-26", name: "Sarla Hotel Inn RC 60kW DC", percentChange: -73, duration: "0:59:20", amount: 334, units: 17, prevDuration: "1:03:47", prevAmount: 1256, prevUnits: 63, mtdAmount: 1625, mtdUnits: 81, avgAmountPerDay: 52, avgUnitsPerDay: 3 },
  { sno: 21, liveDate: "30-Mar-26", name: "MCD Parking Muskan Chowk RC 60kW DC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
];

// ---------- 2. Highway DC Chargers ----------
const highwayDCData: ChargerData[] = [
  { sno: 1, liveDate: "26-Apr-25", name: "Shiva Dhaba Hapur RC 60kW DC", percentChange: -24, duration: "2:04:18", amount: 654, units: 34, prevDuration: "1:07:29", prevAmount: 858, prevUnits: 45, mtdAmount: 32354, mtdUnits: 1703, avgAmountPerDay: 1044, avgUnitsPerDay: 55 },
  { sno: 2, liveDate: "24-Jun-25", name: "Shiva Dhaba Garh Mukteshwar RC 60kW DC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:21:35", prevAmount: 389, prevUnits: 20, mtdAmount: 16185, mtdUnits: 852, avgAmountPerDay: 522, avgUnitsPerDay: 27 },
  { sno: 3, liveDate: "30-Jul-25", name: "Shiva Dhaba Mama Yadav Garh Mukteshwar RC 60kW DC", percentChange: -66, duration: "1:07:21", amount: 558, units: 29, prevDuration: "1:59:05", prevAmount: 1647, prevUnits: 87, mtdAmount: 22879, mtdUnits: 1211, avgAmountPerDay: 738, avgUnitsPerDay: 39 },
  { sno: 4, liveDate: "22-Sep-25", name: "Shiva Dhaba Mama Yadav Athsaini RC 120kW DC", percentChange: -76, duration: "0:44:28", amount: 286, units: 15, prevDuration: "1:13:23", prevAmount: 1206, prevUnits: 63, mtdAmount: 16614, mtdUnits: 874, avgAmountPerDay: 536, avgUnitsPerDay: 28 },
  { sno: 5, liveDate: "28-Oct-25", name: "Hotel Highway King Neelka RC 120kW DC", percentChange: -53, duration: "2:52:45", amount: 2235, units: 106, prevDuration: "5:47:14", prevAmount: 4755, prevUnits: 226, mtdAmount: 93086, mtdUnits: 4433, avgAmountPerDay: 3003, avgUnitsPerDay: 143 },
  { sno: 6, liveDate: "28-Oct-25", name: "Hotel Highway King Shahpura RC 120kW DC", percentChange: -30, duration: "5:56:07", amount: 5238, units: 249, prevDuration: "12:15:18", prevAmount: 7534, prevUnits: 359, mtdAmount: 76702, mtdUnits: 3652, avgAmountPerDay: 2474, avgUnitsPerDay: 118 },
  { sno: 7, liveDate: "03-Nov-25", name: "Hotel Highway King Bilaspur RC 120kW DC", percentChange: -21, duration: "2:30:26", amount: 1791, units: 85, prevDuration: "2:57:42", prevAmount: 2268, prevUnits: 108, mtdAmount: 56884, mtdUnits: 2709, avgAmountPerDay: 1835, avgUnitsPerDay: 87 },
  { sno: 8, liveDate: "15-Nov-25", name: "Shiva Dhaba Avneesh Sharma Bajheri RC 60kW DC", percentChange: -30, duration: "1:19:36", amount: 663, units: 35, prevDuration: "1:49:15", prevAmount: 943, prevUnits: 50, mtdAmount: 26357, mtdUnits: 1387, avgAmountPerDay: 850, avgUnitsPerDay: 45 },
  { sno: 9, liveDate: "27-Nov-25", name: "Shiva Dhaba Avneesh Sharma Barla RC 60kW DC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 11445, mtdUnits: 602, avgAmountPerDay: 369, avgUnitsPerDay: 19 },
];

// ---------- 3. Stand‑Alone AC Chargers ----------
const standAloneACData: ChargerData[] = [
  { sno: 1, liveDate: "25-Jan-25", name: "BigBazaar Ameerpet RC 22 kW AC 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 1857, mtdUnits: 103, avgAmountPerDay: 60, avgUnitsPerDay: 3 },
  { sno: 2, liveDate: "25-Jan-25", name: "BigBazaar Ameerpet RC 22 kW AC 2", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:31", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 3, liveDate: "25-Jan-25", name: "G S Center Point RC 22 kW AC 1", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "1:47:02", prevAmount: 362, prevUnits: 20, mtdAmount: 7047, mtdUnits: 391, avgAmountPerDay: 227, avgUnitsPerDay: 13 },
  { sno: 4, liveDate: "25-Jan-25", name: "G S Center Point RC 22 kW AC 2", percentChange: "#DIV/0!", duration: "2:42:36", amount: 346, units: 19, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 2858, mtdUnits: 159, avgAmountPerDay: 92, avgUnitsPerDay: 5 },
  { sno: 5, liveDate: "02-Jun-25", name: "Waghoba Eco Lodge RC 22 kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 6, liveDate: "04-Jul-25", name: "Kings Lodge RC 22 kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 7, liveDate: "14-Aug-25", name: "Bhairon Mandir Marg RC 10 kW AC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:20:06", prevAmount: 16, prevUnits: 1, mtdAmount: 647, mtdUnits: 43, avgAmountPerDay: 21, avgUnitsPerDay: 1 },
  { sno: 8, liveDate: "14-Aug-25", name: "Bhairon Mandir Marg RC 3.3 kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 112, mtdUnits: 7, avgAmountPerDay: 4, avgUnitsPerDay: 0 },
  { sno: 9, liveDate: "29-Aug-25", name: "Titagarh RC 22KW AC 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 10, liveDate: "29-Aug-25", name: "Titagarh RC 22KW AC 2", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 420, mtdUnits: 32, avgAmountPerDay: 14, avgUnitsPerDay: 1 },
  { sno: 11, liveDate: "29-Aug-25", name: "Titagarh RC 22KW AC 3", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 364, mtdUnits: 26, avgAmountPerDay: 12, avgUnitsPerDay: 1 },
  { sno: 12, liveDate: "06-Sep-25", name: "Bhogal RC 10kW AC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "6:25:52", prevAmount: 161, prevUnits: 11, mtdAmount: 6371, mtdUnits: 425, avgAmountPerDay: 206, avgUnitsPerDay: 14 },
  { sno: 13, liveDate: "25-Sep-25", name: "Chirag Delhi RC 10kW AC", percentChange: 45, duration: "1:35:46", amount: 60, units: 4, prevDuration: "0:59:59", prevAmount: 41, prevUnits: 3, mtdAmount: 777, mtdUnits: 52, avgAmountPerDay: 25, avgUnitsPerDay: 2 },
  { sno: 14, liveDate: "29-Sep-25", name: "Dhaula Kuan RC 3.3kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 491, mtdUnits: 33, avgAmountPerDay: 16, avgUnitsPerDay: 1 },
  { sno: 15, liveDate: "30-Sep-25", name: "CDR Chowk RC 3.3kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 146, mtdUnits: 10, avgAmountPerDay: 5, avgUnitsPerDay: 0 },
  { sno: 16, liveDate: "01-Oct-25", name: "IIT Metro Munirka RC 10 kW AC", percentChange: "#DIV/0!", duration: "1:30:05", amount: 21, units: 1, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 441, mtdUnits: 29, avgAmountPerDay: 14, avgUnitsPerDay: 1 },
  { sno: 17, liveDate: "01-Oct-25", name: "IIT Metro Munirka RC 3.3kW AC", percentChange: "#DIV/0!", duration: "0:37:30", amount: 15, units: 1, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 15, mtdUnits: 1, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 18, liveDate: "01-Oct-25", name: "Moti Bagh RC 3.3kW AC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:25:57", prevAmount: 20, prevUnits: 1, mtdAmount: 328, mtdUnits: 22, avgAmountPerDay: 11, avgUnitsPerDay: 1 },
  { sno: 19, liveDate: "01-Oct-25", name: "Munirka Near Udupi RC 10 kW AC", percentChange: -37, duration: "1:00:41", amount: 15, units: 1, prevDuration: "0:57:46", prevAmount: 23, prevUnits: 2, mtdAmount: 166, mtdUnits: 11, avgAmountPerDay: 5, avgUnitsPerDay: 0 },
  { sno: 20, liveDate: "01-Oct-25", name: "Munirka Near Udupi RC 3.3kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 81, mtdUnits: 5, avgAmountPerDay: 3, avgUnitsPerDay: 0 },
  { sno: 21, liveDate: "01-Oct-25", name: "Munirka RC 3.3kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 669, mtdUnits: 45, avgAmountPerDay: 22, avgUnitsPerDay: 1 },
  { sno: 22, liveDate: "01-Oct-25", name: "Nelson Mandela Road RC 10kW AC", percentChange: -45, duration: "1:57:07", amount: 75, units: 5, prevDuration: "3:35:02", prevAmount: 136, prevUnits: 9, mtdAmount: 4900, mtdUnits: 327, avgAmountPerDay: 158, avgUnitsPerDay: 11 },
  { sno: 23, liveDate: "01-Oct-25", name: "Nelson Mandela Road RC 3.3kW AC", percentChange: "#DIV/0!", duration: "5:56:53", amount: 207, units: 14, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 756, mtdUnits: 50, avgAmountPerDay: 24, avgUnitsPerDay: 2 },
  { sno: 24, liveDate: "01-Oct-25", name: "Pragati Maidan Mtka Peer RC 3.3kW AC", percentChange: "#DIV/0!", duration: "0:50:33", amount: 30, units: 2, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 153, mtdUnits: 10, avgAmountPerDay: 5, avgUnitsPerDay: 0 },
  { sno: 25, liveDate: "04-Oct-25", name: "CGO Complex RC 10kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 26, liveDate: "06-Oct-25", name: "Chirag Delhi RC 3.3kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 1129, mtdUnits: 75, avgAmountPerDay: 36, avgUnitsPerDay: 2 },
  { sno: 27, liveDate: "19-Oct-25", name: "Airport road RC 10kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 267, mtdUnits: 19, avgAmountPerDay: 9, avgUnitsPerDay: 1 },
  { sno: 28, liveDate: "04-Nov-25", name: "Munirka RC 10kW AC", percentChange: "#DIV/0!", duration: "7:40:21", amount: 42, units: 3, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 244, mtdUnits: 16, avgAmountPerDay: 8, avgUnitsPerDay: 1 },
  { sno: 29, liveDate: "07-Nov-25", name: "CDR Chowk RC 10kW AC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "1:20:50", prevAmount: 60, prevUnits: 4, mtdAmount: 891, mtdUnits: 59, avgAmountPerDay: 29, avgUnitsPerDay: 2 },
  { sno: 30, liveDate: "17-Nov-25", name: "Parx Laureate RC 7.4kW AC 1", percentChange: "#DIV/0!", duration: "5:52:35", amount: 122, units: 11, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 7246, mtdUnits: 630, avgAmountPerDay: 234, avgUnitsPerDay: 20 },
  { sno: 31, liveDate: "17-Nov-25", name: "Parx Laureate RC 7.4kW AC 2", percentChange: -69, duration: "5:07:53", amount: 178, units: 15, prevDuration: "8:47:14", prevAmount: 565, prevUnits: 49, mtdAmount: 6285, mtdUnits: 547, avgAmountPerDay: 203, avgUnitsPerDay: 18 },
  { sno: 32, liveDate: "17-Nov-25", name: "Parx Laureate RC 7.4kW AC 3", percentChange: 13, duration: "6:09:04", amount: 288, units: 25, prevDuration: "3:15:47", prevAmount: 256, prevUnits: 22, mtdAmount: 10187, mtdUnits: 886, avgAmountPerDay: 329, avgUnitsPerDay: 29 },
  { sno: 33, liveDate: "23-Dec-25", name: "Parx Laureate RC 7.4kW AC 4", percentChange: -40, duration: "7:09:04", amount: 476, units: 41, prevDuration: "9:27:41", prevAmount: 800, prevUnits: 70, mtdAmount: 8940, mtdUnits: 777, avgAmountPerDay: 288, avgUnitsPerDay: 25 },
  { sno: 34, liveDate: "05-Jan-26", name: "Mangal Apartment Vasundhra RC 10kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 24, mtdUnits: 2, avgAmountPerDay: 1, avgUnitsPerDay: 0 },
  { sno: 35, liveDate: "05-Jan-26", name: "Mangal Apartment Vasundhra RC 11kW AC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "3:53:49", prevAmount: 495, prevUnits: 41, mtdAmount: 3344, mtdUnits: 279, avgAmountPerDay: 108, avgUnitsPerDay: 9 },
  { sno: 36, liveDate: "09-Jan-26", name: "Noida Sector 2 RC 3.3 kW AC", percentChange: 103, duration: "1:22:19", amount: 31, units: 2, prevDuration: "0:21:15", prevAmount: 15, prevUnits: 1, mtdAmount: 1148, mtdUnits: 77, avgAmountPerDay: 37, avgUnitsPerDay: 2 },
  { sno: 37, liveDate: "09-Jan-26", name: "Una Enclave Mayur Vihar RC 10kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 38, liveDate: "14-Jan-26", name: "Beverly Hills Apartment 7.4kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 1228, mtdUnits: 102, avgAmountPerDay: 40, avgUnitsPerDay: 3 },
  { sno: 39, liveDate: "19-Jan-26", name: "Metro Niketan Noida 7.4kW AC 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 2318, mtdUnits: 193, avgAmountPerDay: 75, avgUnitsPerDay: 6 },
  { sno: 40, liveDate: "19-Jan-26", name: "Parx Laureate RC 7.4kW AC 5", percentChange: -65, duration: "4:25:12", amount: 277, units: 24, prevDuration: "10:17:15", prevAmount: 789, prevUnits: 69, mtdAmount: 8631, mtdUnits: 751, avgAmountPerDay: 278, avgUnitsPerDay: 24 },
  { sno: 41, liveDate: "21-Jan-26", name: "Parx Laureate RC 7.4kW AC 6", percentChange: 131, duration: "3:06:56", amount: 139, units: 12, prevDuration: "1:41:32", prevAmount: 60, prevUnits: 5, mtdAmount: 5650, mtdUnits: 491, avgAmountPerDay: 182, avgUnitsPerDay: 16 },
  { sno: 42, liveDate: "22-Jan-26", name: "Beverly Hills Apartment 10kW AC", percentChange: "#DIV/0!", duration: "6:55:34", amount: 213, units: 18, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 594, mtdUnits: 50, avgAmountPerDay: 19, avgUnitsPerDay: 2 },
  { sno: 43, liveDate: "25-Jan-26", name: "Pragati Maidan Mtka Peer RC 44kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 317, mtdUnits: 21, avgAmountPerDay: 10, avgUnitsPerDay: 1 },
  { sno: 44, liveDate: "03-Feb-26", name: "Hindustan Times Apartment Mayur Vihar 7.4kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 290, mtdUnits: 24, avgAmountPerDay: 9, avgUnitsPerDay: 1 },
  { sno: 45, liveDate: "03-Feb-26", name: "Hindustan Times Apartment Mayur Vihar 10kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 590, mtdUnits: 49, avgAmountPerDay: 19, avgUnitsPerDay: 2 },
  { sno: 46, liveDate: "03-Feb-26", name: "Aditya City Apartment RC 7.4kW AC 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 483, mtdUnits: 47, avgAmountPerDay: 16, avgUnitsPerDay: 2 },
  { sno: 47, liveDate: "03-Feb-26", name: "Aditya City Apartment RC 7.4kW AC 2", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 821, mtdUnits: 80, avgAmountPerDay: 26, avgUnitsPerDay: 3 },
  { sno: 48, liveDate: "04-Feb-26", name: "Metro Niketan Noida 7.4kW AC 2", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 2446, mtdUnits: 204, avgAmountPerDay: 79, avgUnitsPerDay: 7 },
  { sno: 49, liveDate: "09-Feb-26", name: "Bhogal RC 10kW AC 2", percentChange: -94, duration: "0:20:39", amount: 6, units: 0, prevDuration: "2:32:55", prevAmount: 100, prevUnits: 7, mtdAmount: 6583, mtdUnits: 439, avgAmountPerDay: 212, avgUnitsPerDay: 14 },
  { sno: 50, liveDate: "25-Feb-26", name: "MCD Parking Baldev Park near shivaji dharmshala RC 10kW AC 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 54, mtdUnits: 4, avgAmountPerDay: 2, avgUnitsPerDay: 0 },
  { sno: 51, liveDate: "25-Feb-26", name: "MCD Parking Baldev Park near shivaji dharmshala RC 10kW AC 2", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 203, mtdUnits: 14, avgAmountPerDay: 7, avgUnitsPerDay: 0 },
  { sno: 52, liveDate: "07-Mar-26", name: "Gardenia Glory RC 7.4kW AC 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 290, mtdUnits: 19, avgAmountPerDay: 9, avgUnitsPerDay: 1 },
  { sno: 53, liveDate: "07-Mar-26", name: "Gardenia Glory RC 7.4kW AC 2", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 3, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 54, liveDate: "08-Mar-26", name: "Bhogal RC 10kW AC 3", percentChange: 191, duration: "17:08:52", amount: 652, units: 43, prevDuration: "9:06:34", prevAmount: 224, prevUnits: 15, mtdAmount: 5691, mtdUnits: 379, avgAmountPerDay: 184, avgUnitsPerDay: 12 },
  { sno: 55, liveDate: "14-Mar-26", name: "Dhaula Kuan RC 10kW AC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "1:15:35", prevAmount: 43, prevUnits: 3, mtdAmount: 530, mtdUnits: 35, avgAmountPerDay: 17, avgUnitsPerDay: 1 },
  { sno: 56, liveDate: "14-Mar-26", name: "Gardenia Glory RC 7.4kW AC 3", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "3:20:36", prevAmount: 346, prevUnits: 23, mtdAmount: 1502, mtdUnits: 100, avgAmountPerDay: 48, avgUnitsPerDay: 3 },
  { sno: 57, liveDate: "14-Mar-26", name: "Moti Bagh RC 10kW AC", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:15:05", prevAmount: 8, prevUnits: 1, mtdAmount: 122, mtdUnits: 8, avgAmountPerDay: 4, avgUnitsPerDay: 0 },
  { sno: 58, liveDate: "14-Mar-26", name: "MCD Parking Quarter Dilshad Garden RC 10kW AC 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 17, mtdUnits: 1, avgAmountPerDay: 1, avgUnitsPerDay: 0 },
  { sno: 59, liveDate: "14-Mar-26", name: "MCD Parking Quarter Dilshad Garden RC 10kW AC 2", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 3, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 60, liveDate: "14-Mar-26", name: "ATS Pristine RC 7.4kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 61, liveDate: "16-Mar-26", name: "Rajokri RC 10kW AC", percentChange: -5, duration: "0:28:29", amount: 21, units: 1, prevDuration: "0:31:55", prevAmount: 22, prevUnits: 1, mtdAmount: 789, mtdUnits: 53, avgAmountPerDay: 25, avgUnitsPerDay: 2 },
  { sno: 62, liveDate: "17-Mar-26", name: "ATS Greens Paradiso RC 7.4kW AC 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 63, liveDate: "17-Mar-26", name: "ATS Greens Paradiso RC 7.4kW AC 2", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "6:00:35", prevAmount: 248, prevUnits: 28, mtdAmount: 596, mtdUnits: 66, avgAmountPerDay: 19, avgUnitsPerDay: 2 },
  { sno: 64, liveDate: "23-Mar-26", name: "Maharaja Agrasen College Vasundhara Enclave RC 15kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 65, liveDate: "23-Mar-26", name: "Maharaja Agrasen College Vasundhara Enclave RC 10kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 66, liveDate: "23-Mar-26", name: "Chacha Nehru Bal Chikitsalaya RC 10kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 67, liveDate: "23-Mar-26", name: "Chacha Nehru Bal Chikitsalaya RC 15kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 1, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 68, liveDate: "23-Mar-26", name: "MCD Parking Muskan Chowk 10kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 42, mtdUnits: 3, avgAmountPerDay: 1, avgUnitsPerDay: 0 },
  { sno: 69, liveDate: "25-Mar-26", name: "The Social Stays Dehradun RC 7.4kW AC", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 22, mtdUnits: 1, avgAmountPerDay: 1, avgUnitsPerDay: 0 },
];

// ---------- 4. Noida Hub Sector 135 ----------
const noidaHubData: ChargerData[] = [
  { sno: 1, liveDate: "15-May-25", name: "Noida Hub RC 3.3kW AC Charger 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 0, mtdUnits: 0, avgAmountPerDay: 0, avgUnitsPerDay: 0 },
  { sno: 2, liveDate: "15-May-25", name: "Noida Hub RC 60kW DC Charger 1", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 2952, mtdUnits: 219, avgAmountPerDay: 95, avgUnitsPerDay: 7 },
  { sno: 3, liveDate: "15-May-25", name: "Noida Hub RC 60kW DC Charger 2", percentChange: 58, duration: "24:05:37", amount: 1172, units: 87, prevDuration: "9:12:22", prevAmount: 741, prevUnits: 55, mtdAmount: 36597, mtdUnits: 2697, avgAmountPerDay: 1181, avgUnitsPerDay: 87 },
  { sno: 4, liveDate: "15-May-25", name: "Noida Hub RC 60kW DC Charger 3", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 12289, mtdUnits: 895, avgAmountPerDay: 396, avgUnitsPerDay: 29 },
  { sno: 5, liveDate: "15-May-25", name: "Noida Hub RC 60kW DC Charger 4", percentChange: -6, duration: "5:27:59", amount: 644, units: 48, prevDuration: "5:29:48", prevAmount: 680, prevUnits: 51, mtdAmount: 14722, mtdUnits: 1107, avgAmountPerDay: 475, avgUnitsPerDay: 36 },
  { sno: 6, liveDate: "15-May-25", name: "Noida Hub RC 60kW DC Charger 5", percentChange: -24, duration: "1:29:10", amount: 296, units: 22, prevDuration: "1:56:18", prevAmount: 384, prevUnits: 29, mtdAmount: 14930, mtdUnits: 1104, avgAmountPerDay: 482, avgUnitsPerDay: 36 },
  { sno: 7, liveDate: "15-May-25", name: "Noida Hub RC 60kW DC Charger 6", percentChange: -12, duration: "2:59:28", amount: 554, units: 40, prevDuration: "2:35:43", prevAmount: 631, prevUnits: 45, mtdAmount: 14490, mtdUnits: 1037, avgAmountPerDay: 467, avgUnitsPerDay: 33 },
  { sno: 8, liveDate: "15-May-25", name: "Noida Hub RC 7.4kW AC Charger 1", percentChange: 73, duration: "2:11:10", amount: 188, units: 14, prevDuration: "1:15:02", prevAmount: 109, prevUnits: 8, mtdAmount: 4807, mtdUnits: 350, avgAmountPerDay: 155, avgUnitsPerDay: 11 },
  { sno: 9, liveDate: "15-May-25", name: "Noida Hub RC 7.4kW AC Charger 2", percentChange: "#DIV/0!", duration: "0:32:27", amount: 49, units: 4, prevDuration: "0:04:01", prevAmount: 0, prevUnits: 0, mtdAmount: 5202, mtdUnits: 357, avgAmountPerDay: 168, avgUnitsPerDay: 12 },
  { sno: 10, liveDate: "02-Mar-26", name: "Noida Hub RC 7.4kW AC Charger 3", percentChange: "#DIV/0!", duration: "0:00:00", amount: 0, units: 0, prevDuration: "0:00:00", prevAmount: 0, prevUnits: 0, mtdAmount: 143, mtdUnits: 11, avgAmountPerDay: 5, avgUnitsPerDay: 0 },
  { sno: 11, liveDate: "07-Jul-25", name: "Sector 135 RC 120kW DC", percentChange: 28, duration: "12:22:52", amount: 3823, units: 258, prevDuration: "10:10:57", prevAmount: 3067, prevUnits: 202, mtdAmount: 91608, mtdUnits: 5997, avgAmountPerDay: 2955, avgUnitsPerDay: 193 },
  { sno: 12, liveDate: "07-Jul-25", name: "Sector 135 RC 60kW DC", percentChange: 86, duration: "15:37:14", amount: 2775, units: 196, prevDuration: "8:00:50", prevAmount: 1427, prevUnits: 105, mtdAmount: 33462, mtdUnits: 2348, avgAmountPerDay: 1079, avgUnitsPerDay: 76 },
  { sno: 13, liveDate: "02-Dec-25", name: "Noida Hub RC 10kW AC Charger 1", percentChange: -100, duration: "0:00:00", amount: 0, units: 0, prevDuration: "1:36:10", prevAmount: 74, prevUnits: 4, mtdAmount: 2273, mtdUnits: 127, avgAmountPerDay: 73, avgUnitsPerDay: 4 },
];

type TimeFilter = "yesterday" | "lastWeek" | "lastMonth" | "all";

// Helper: scale numeric fields based on time filter
const scaleData = (data: ChargerData[], filter: TimeFilter): ChargerData[] => {
  if (filter === "all") return data;
  let factor = 1;
  if (filter === "yesterday") factor = 0.03;
  if (filter === "lastWeek") factor = 0.2;
  if (filter === "lastMonth") factor = 0.8;

  return data.map(item => ({
    ...item,
    amount: Math.floor(item.amount * factor),
    units: Math.floor(item.units * factor),
    prevAmount: Math.floor(item.prevAmount * factor),
    prevUnits: Math.floor(item.prevUnits * factor),
    mtdAmount: Math.floor(item.mtdAmount * factor),
    mtdUnits: Math.floor(item.mtdUnits * factor),
    avgAmountPerDay: Math.floor(item.avgAmountPerDay * factor),
    avgUnitsPerDay: Math.floor(item.avgUnitsPerDay * factor),
  }));
};

// Helper: compute totals for a table
const computeTotals = (data: ChargerData[]) => {
  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
  const totalUnits = data.reduce((sum, d) => sum + d.units, 0);
  const totalPrevAmount = data.reduce((sum, d) => sum + d.prevAmount, 0);
  const totalMTDAmount = data.reduce((sum, d) => sum + d.mtdAmount, 0);
  const totalMTDUnits = data.reduce((sum, d) => sum + d.mtdUnits, 0);
  return { totalAmount, totalUnits, totalPrevAmount, totalMTDAmount, totalMTDUnits };
};

export default function DailyTransactionsReport() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  // Apply filter to all categories
  const filteredStandAloneDC = useMemo(() => scaleData(standAloneDCData, timeFilter), [timeFilter]);
  const filteredHighwayDC = useMemo(() => scaleData(highwayDCData, timeFilter), [timeFilter]);
  const filteredStandAloneAC = useMemo(() => scaleData(standAloneACData, timeFilter), [timeFilter]);
  const filteredNoidaHub = useMemo(() => scaleData(noidaHubData, timeFilter), [timeFilter]);

  const getFilterLabel = () => {
    switch (timeFilter) {
      case "yesterday": return "Yesterday";
      case "lastWeek": return "Last Week";
      case "lastMonth": return "Last Month";
      default: return "All Time";
    }
  };

  const getPercentChangeColor = (change: number | string) => {
    if (change === "#DIV/0!") return "text-gray-400";
    const num = typeof change === "number" ? change : 0;
    if (num > 0) return "text-green-600";
    if (num < 0) return "text-red-600";
    return "text-gray-500";
  };

  const getPercentChangeIcon = (change: number | string) => {
    if (change === "#DIV/0!") return null;
    const num = typeof change === "number" ? change : 0;
    if (num > 0) return <TrendingUp size={10} className="text-green-600" />;
    if (num < 0) return <TrendingDown size={10} className="text-red-600" />;
    return null;
  };

  // Export all data (combined CSV)
  const exportToCSV = () => {
    const allData = [...filteredStandAloneDC, ...filteredHighwayDC, ...filteredStandAloneAC, ...filteredNoidaHub];
    const headers = ["S.No", "Live Date", "Charger Name", "% Change", "Duration", "Amount", "Units", "Prev Duration", "Prev Amount", "Prev Units", "MTD Amount", "MTD Units", "Avg Amount/Day", "Avg Units/Day"];
    const rows = allData.map((c, i) => [
      i + 1, c.liveDate, c.name, c.percentChange, c.duration, c.amount, c.units,
      c.prevDuration, c.prevAmount, c.prevUnits, c.mtdAmount, c.mtdUnits,
      c.avgAmountPerDay, c.avgUnitsPerDay
    ]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-report-${getFilterLabel()}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Table renderer
  const renderTable = (title: string, data: ChargerData[]) => {
    const totals = computeTotals(data);
    return (
      <div className="mb-8">
        <h3 className="text-base font-semibold text-gray-700 mb-2">{title}</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-2 py-2 text-left font-semibold text-gray-600 w-10">S.No</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-600 w-20">Live Date</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-600">Charger Name</th>
                  <th className="px-2 py-2 text-center font-semibold text-gray-600 w-16">% Change</th>
                  <th className="px-2 py-2 text-center font-semibold text-gray-600 w-20">Duration</th>
                  <th className="px-2 py-2 text-right font-semibold text-gray-600 w-20">Amount (₹)</th>
                  <th className="px-2 py-2 text-right font-semibold text-gray-600 w-20">Units (kWh)</th>
                  <th className="px-2 py-2 text-center font-semibold text-gray-600 w-20">Prev Duration</th>
                  <th className="px-2 py-2 text-right font-semibold text-gray-600 w-20">Prev Amount</th>
                  <th className="px-2 py-2 text-right font-semibold text-gray-600 w-16">Prev Units</th>
                  <th className="px-2 py-2 text-right font-semibold text-gray-600 w-20">MTD Amount</th>
                  <th className="px-2 py-2 text-right font-semibold text-gray-600 w-16">MTD Units</th>
                  <th className="px-2 py-2 text-right font-semibold text-gray-600 w-20">Avg Amount/Day</th>
                  <th className="px-2 py-2 text-right font-semibold text-gray-600 w-20">Avg Units/Day</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((charger, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-1.5 text-gray-500">{idx + 1}</td>
                    <td className="px-2 py-1.5 text-gray-600 whitespace-nowrap">{charger.liveDate}</td>
                    <td className="px-2 py-1.5 text-gray-700 max-w-[220px] truncate" title={charger.name}>{charger.name}</td>
                    <td className="px-2 py-1.5 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {getPercentChangeIcon(charger.percentChange)}
                        <span className={getPercentChangeColor(charger.percentChange)}>
                          {typeof charger.percentChange === 'number' ? `${charger.percentChange}%` : charger.percentChange}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-center text-gray-500">{charger.duration}</td>
                    <td className="px-2 py-1.5 text-right font-medium text-gray-700">₹{charger.amount.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-right text-gray-600">{charger.units.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-center text-gray-400">{charger.prevDuration}</td>
                    <td className="px-2 py-1.5 text-right text-gray-500">₹{charger.prevAmount.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-right text-gray-500">{charger.prevUnits.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-right text-blue-700 font-medium">₹{charger.mtdAmount.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-right text-green-700 font-medium">{charger.mtdUnits.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-right text-gray-700">₹{charger.avgAmountPerDay.toLocaleString()}</td>
                    <td className="px-2 py-1.5 text-right text-gray-700">{charger.avgUnitsPerDay.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 border-t border-gray-200 font-medium">
                <tr>
                  <td colSpan={5} className="px-2 py-1.5 text-right text-gray-600 text-[10px]">Total:</td>
                  <td className="px-2 py-1.5 text-right text-gray-800 font-semibold">₹{totals.totalAmount.toLocaleString()}</td>
                  <td className="px-2 py-1.5 text-right text-gray-800 font-semibold">{totals.totalUnits.toLocaleString()}</td>
                  <td colSpan={2}></td>
                  <td className="px-2 py-1.5 text-right text-gray-600">₹{totals.totalPrevAmount.toLocaleString()}</td>
                  <td className="px-2 py-1.5 text-right text-blue-700 font-semibold">₹{totals.totalMTDAmount.toLocaleString()}</td>
                  <td className="px-2 py-1.5 text-right text-green-700 font-semibold">{totals.totalMTDUnits.toLocaleString()}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-x-hidden">
      <div className="w-full px-4 py-4 mt-16">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Daily CMS Transactions Report</h1>
          <p className="text-xs text-gray-500 mt-1">Tuesday, 31st March 2026</p>
        </div>

        {/* Time Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-5">
          {(["all", "yesterday", "lastWeek", "lastMonth"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                timeFilter === filter
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {filter === "all" ? "All Time" : filter === "yesterday" ? "Yesterday" : filter === "lastWeek" ? "Last Week" : "Last Month"}
            </button>
          ))}
        </div>

        {/* Active Filter Indicator */}
        {timeFilter !== "all" && (
          <div className="mb-5 px-3 py-1.5 bg-blue-100 rounded-lg inline-flex items-center gap-2">
            <Calendar size={12} className="text-blue-600" />
            <span className="text-xs text-blue-700">
              Showing data for: <strong>{getFilterLabel()}</strong>
            </span>
          </div>
        )}

        {/* All Four Tables */}
        {renderTable("Stand-Alone DC Chargers", filteredStandAloneDC)}
        {renderTable("Highway Stand-Alone DC Chargers", filteredHighwayDC)}
        {renderTable("Stand-Alone AC Chargers", filteredStandAloneAC)}
        {renderTable("Noida Hub Sector 135", filteredNoidaHub)}

        {/* Export Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={exportToCSV}
            className="px-4 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm text-gray-600"
          >
            <Download size={12} /> Export Report
          </button>
        </div>
      </div>
    </div>
  );
}