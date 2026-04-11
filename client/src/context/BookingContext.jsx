import { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

const INITIAL = {
  movie: null,
  rap: null,
  selectedDate: null,
  showtime: null,  // { id_lc, id_gio, thoi_gian_chieu, ten_phong, id_phong }
  seats: [],       // array of seat name strings ["A1","A2"]
  seatPrice: 0,
  combos: [],      // array of combo strings
  comboPrice: 0,
  discount: 0,
  diemDoi: 0,
  giamGiaDiem: 0,
  idKm: null,
};

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(() => {
    try {
      const saved = sessionStorage.getItem('booking');
      return saved ? JSON.parse(saved) : INITIAL;
    } catch { return INITIAL; }
  });

  useEffect(() => {
    sessionStorage.setItem('booking', JSON.stringify(booking));
  }, [booking]);

  const setMovie   = (movie)    => setBooking(p => ({ ...p, movie }));
  const setRap     = (rap)      => setBooking(p => ({ ...p, rap, selectedDate: null, showtime: null, seats: [], seatPrice: 0 }));
  const setDate    = (date)     => setBooking(p => ({ ...p, selectedDate: date, showtime: null, seats: [], seatPrice: 0 }));
  const setShowtime = (st)      => setBooking(p => ({ ...p, showtime: st, seats: [], seatPrice: 0 }));
  const setSeats   = (seats, price) => setBooking(p => ({ ...p, seats, seatPrice: price }));
  const setCombos  = (combos, price) => setBooking(p => ({ ...p, combos, comboPrice: price }));
  const setDiscount = (discount, idKm) => setBooking(p => ({ ...p, discount, idKm }));
  const setDiemDoi = (diem, giam) => setBooking(p => ({ ...p, diemDoi: diem, giamGiaDiem: giam }));

  const totalPrice = () => {
    const base = booking.seatPrice + booking.comboPrice;
    return Math.max(0, base - booking.discount - booking.giamGiaDiem);
  };

  const reset = () => {
    sessionStorage.removeItem('booking');
    setBooking(INITIAL);
  };

  return (
    <BookingContext.Provider value={{
      booking, setMovie, setRap, setDate, setShowtime,
      setSeats, setCombos, setDiscount, setDiemDoi, totalPrice, reset,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
