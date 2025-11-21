package com.ezhealthcare.EZHealthcare.util;

import java.sql.Date;
import java.sql.Time;
import java.util.Calendar;
import java.util.TimeZone;

public class TimeZoneUtil {
    private static final TimeZone MYANMAR_TIMEZONE = TimeZone.getTimeZone("Asia/Yangon");

    public static Date convertToMyanmarDate(Date date) {
        if (date == null) return null;

        Calendar calendar = Calendar.getInstance(MYANMAR_TIMEZONE);
        calendar.setTime(date);

        return new Date(calendar.getTimeInMillis());
    }

    public static Time convertToMyanmarTime(Time time) {
        if (time == null) return null;

        Calendar calendar = Calendar.getInstance(MYANMAR_TIMEZONE);
        calendar.setTimeInMillis(time.getTime());

        return new Time(calendar.getTimeInMillis());
    }
}
