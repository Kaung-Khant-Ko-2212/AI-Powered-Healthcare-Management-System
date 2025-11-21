package com.ezhealthcare.EZHealthcare.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiter {
    private final Map<String, Integer> hourlyAttempts = new ConcurrentHashMap<>();
    private final Map<String, Integer> dailyAttempts = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> hourlyResetTime = new ConcurrentHashMap<>();
    private final Map<String, LocalDate> dailyResetDate = new ConcurrentHashMap<>();

    private static final int MAX_HOURLY_ATTEMPTS = 3;
    private static final int MAX_DAILY_ATTEMPTS = 5;

    public boolean checkRateLimit(Long userId) {
        String userKey = userId.toString();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        // Reset hourly attempts if an hour has passed
        if (hourlyResetTime.containsKey(userKey) &&
                now.isAfter(hourlyResetTime.get(userKey).plusHours(1))) {
            hourlyAttempts.put(userKey, 0);
            hourlyResetTime.put(userKey, now);
        }

        // Reset daily attempts if day has changed
        if (dailyResetDate.containsKey(userKey) &&
                !today.equals(dailyResetDate.get(userKey))) {
            dailyAttempts.put(userKey, 0);
            dailyResetDate.put(userKey, today);
        }

        // Initialize attempts if not present
        hourlyAttempts.putIfAbsent(userKey, 0);
        dailyAttempts.putIfAbsent(userKey, 0);
        hourlyResetTime.putIfAbsent(userKey, now);
        dailyResetDate.putIfAbsent(userKey, today);

        // Check limits
        if (hourlyAttempts.get(userKey) >= MAX_HOURLY_ATTEMPTS) {
            throw new RuntimeException("Too many booking attempts in one hour. Please try again later.");
        }

        if (dailyAttempts.get(userKey) >= MAX_DAILY_ATTEMPTS) {
            throw new RuntimeException("Daily booking limit reached. Please try again tomorrow.");
        }

        // Increment attempts
        hourlyAttempts.put(userKey, hourlyAttempts.get(userKey) + 1);
        dailyAttempts.put(userKey, dailyAttempts.get(userKey) + 1);

        return true;
    }
}
