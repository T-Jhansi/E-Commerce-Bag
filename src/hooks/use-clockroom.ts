"use client";

import { useCallback, useEffect, useState } from "react";
import { ClockRoomBooking } from "@/lib/types";
import { getAllBookings, getBookingById, subscribeBookings } from "@/lib/clockroom-store";

export function useBookings() {
  const [bookings, setBookings] = useState<ClockRoomBooking[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setBookings(getAllBookings());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    return subscribeBookings(refresh);
  }, [refresh]);

  return { bookings, ready, refresh };
}

export function useBooking(id: string | undefined) {
  const [booking, setBooking] = useState<ClockRoomBooking | undefined>(undefined);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    if (!id) {
      setBooking(undefined);
      setReady(true);
      return;
    }
    setBooking(getBookingById(id));
    setReady(true);
  }, [id]);

  useEffect(() => {
    refresh();
    return subscribeBookings(refresh);
  }, [refresh]);

  return { booking, ready, refresh };
}
