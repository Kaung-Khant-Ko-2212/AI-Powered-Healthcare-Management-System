package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.*;
import com.ezhealthcare.EZHealthcare.repository.ClinicRepository;
import com.ezhealthcare.EZHealthcare.repository.DoctorRepository;
import com.ezhealthcare.EZHealthcare.repository.DoctorScheduleRepository;
import com.ezhealthcare.EZHealthcare.repository.HospitalRepository;
import com.ezhealthcare.EZHealthcare.repository.DoctorClinicsRepository; // New repository
import com.ezhealthcare.EZHealthcare.repository.DoctorHospitalsRepository; // New repository
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class DoctorScheduleService {

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private ClinicRepository clinicRepository;

    @Autowired
    private DoctorClinicsRepository doctorClinicsRepository; // Inject new repository

    @Autowired
    private DoctorHospitalsRepository doctorHospitalsRepository; // Inject new repository

    // Fetch available dates for the next 90 days
    public Set<LocalDate> getAvailableDates(Long doctorId, Long locationId, String locationType) {
        List<DoctorSchedule> schedules;
        if ("hospital".equals(locationType)) {
            schedules = doctorScheduleRepository.findByDoctorIdAndHospitalId(doctorId, locationId);
        } else {
            schedules = doctorScheduleRepository.findByDoctorIdAndClinicId(doctorId, locationId);
        }

        Set<LocalDate> availableDates = new HashSet<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 90; i++) {
            LocalDate date = today.plusDays(i);
            String dayOfWeek = date.getDayOfWeek().toString().toUpperCase();

            if (schedules.stream().anyMatch(schedule ->
                    schedule.getDayOfWeek().name().equalsIgnoreCase(dayOfWeek))) {
                availableDates.add(date);
            }
        }
        return availableDates;
    }

    // Generate time slots based on schedule
    public List<String> getAvailableTimeSlots(Long doctorId, Long locationId, String locationType, LocalDate date) {
        String dayOfWeekStr = date.getDayOfWeek().toString().toUpperCase();
        DayOfWeek dayOfWeek = DayOfWeek.valueOf(dayOfWeekStr);
        List<DoctorSchedule> schedules;

        if ("hospital".equals(locationType)) {
            schedules = doctorScheduleRepository.findByDoctorIdAndHospitalIdAndDayOfWeek(doctorId, locationId, dayOfWeek);
        } else {
            schedules = doctorScheduleRepository.findByDoctorIdAndClinicIdAndDayOfWeek(doctorId, locationId, dayOfWeek);
        }

        List<String> availableSlots = new ArrayList<>();
        for (DoctorSchedule schedule : schedules) {
            LocalTime startTime = schedule.getStartTime().toLocalTime();
            LocalTime endTime = schedule.getEndTime().toLocalTime();

            while (startTime.isBefore(endTime)) {
                availableSlots.add(startTime.toString());
                startTime = startTime.plusHours(1);
            }
        }

        return availableSlots;
    }

    @Transactional
    public void saveSchedules(Map<String, Object> scheduleData) {
        Long doctorId = Long.parseLong(scheduleData.get("doctorId").toString());
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> clinicSchedules = (List<Map<String, Object>>) scheduleData.get("clinicSchedules");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> hospitalSchedules = (List<Map<String, Object>>) scheduleData.get("hospitalSchedules");

        saveSchedules(doctor, clinicSchedules, hospitalSchedules);
    }

    private void saveSchedules(Doctor doctor, List<Map<String, Object>> clinicSchedules, List<Map<String, Object>> hospitalSchedules) {
        // This method could be implemented if needed, but currently unused
    }

    @Transactional
    public void deleteSchedule(Long scheduleId) {
        doctorScheduleRepository.deleteById(scheduleId);
    }

    public List<DoctorSchedule> getSchedulesByDoctor(Long doctorId) {
        return doctorScheduleRepository.findByDoctorId(doctorId);
    }

    public List<DoctorSchedule> getSchedulesByClinic(Long clinicId) {
        return doctorScheduleRepository.findByClinicId(clinicId);
    }

    public List<DoctorSchedule> getSchedulesByHospital(Long hospitalId) {
        return doctorScheduleRepository.findByHospitalId(hospitalId);
    }

    @Transactional
    public void updateDoctorSchedules(Long doctorId, List<Map<String, Object>> schedules) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));

        // Process each schedule from the request
        for (Map<String, Object> scheduleData : schedules) {
            DoctorSchedule schedule;
            Long scheduleId = scheduleData.get("id") != null ? Long.valueOf(scheduleData.get("id").toString()) : null;

            if (scheduleId != null) {
                // Update existing schedule
                schedule = doctorScheduleRepository.findById(scheduleId)
                        .orElseThrow(() -> new RuntimeException("Schedule not found with ID: " + scheduleId));
            } else {
                // Create new schedule
                schedule = new DoctorSchedule();
                schedule.setDoctor(doctor);

                // Also create entries in doctor_clinics or doctor_hospitals for new schedules
                String dayOfWeekStr = (String) scheduleData.get("dayOfWeek");
                String startTime = (String) scheduleData.get("startTime");
                String endTime = (String) scheduleData.get("endTime");
                Long locationId = ((Number) scheduleData.get("locationId")).longValue();
                String locationType = (String) scheduleData.get("locationType");

                if ("hospital".equalsIgnoreCase(locationType)) {
                    Hospital hospital = hospitalRepository.findById(locationId)
                            .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + locationId));
                    DoctorHospitals doctorHospital = new DoctorHospitals();
                    doctorHospital.setDoctor(doctor);
                    doctorHospital.setHospital(hospital);
                    doctorHospital.setDay(dayOfWeekStr); // Use string directly
                    doctorHospital.setStartTime(startTime.length() == 5 ? startTime + ":00" : startTime);
                    doctorHospital.setEndTime(endTime.length() == 5 ? endTime + ":00" : endTime);
                    doctorHospitalsRepository.save(doctorHospital);
                } else if ("clinic".equalsIgnoreCase(locationType)) {
                    Clinic clinic = clinicRepository.findById(locationId)
                            .orElseThrow(() -> new RuntimeException("Clinic not found with ID: " + locationId));
                    DoctorClinics doctorClinic = new DoctorClinics();
                    doctorClinic.setDoctor(doctor);
                    doctorClinic.setClinic(clinic);
                    doctorClinic.setDay(dayOfWeekStr); // Use string directly
                    doctorClinic.setStartTime(startTime.length() == 5 ? startTime + ":00" : startTime);
                    doctorClinic.setEndTime(endTime.length() == 5 ? endTime + ":00" : endTime);
                    doctorClinicsRepository.save(doctorClinic);
                }
            }

            String dayOfWeekStr = (String) scheduleData.get("dayOfWeek");
            if (dayOfWeekStr != null && !dayOfWeekStr.trim().isEmpty()) {
                schedule.setDayOfWeek(DayOfWeek.valueOf(dayOfWeekStr.toUpperCase()));
            } else {
                throw new RuntimeException("Day of week is required");
            }

            String startTime = (String) scheduleData.get("startTime");
            String endTime = (String) scheduleData.get("endTime");
            if (startTime != null && endTime != null && !startTime.trim().isEmpty() && !endTime.trim().isEmpty()) {
                String formattedStartTime = startTime.length() == 5 ? startTime + ":00" : startTime;
                String formattedEndTime = endTime.length() == 5 ? endTime + ":00" : endTime;
                schedule.setStartTime(Time.valueOf(formattedStartTime));
                schedule.setEndTime(Time.valueOf(formattedEndTime));
            } else {
                throw new RuntimeException("Start time and end time are required");
            }

            Long locationId = ((Number) scheduleData.get("locationId")).longValue();
            String locationType = (String) scheduleData.get("locationType");

            if ("hospital".equalsIgnoreCase(locationType)) {
                Hospital hospital = hospitalRepository.findById(locationId)
                        .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + locationId));
                schedule.setHospital(hospital);
                schedule.setClinic(null);
            } else if ("clinic".equalsIgnoreCase(locationType)) {
                Clinic clinic = clinicRepository.findById(locationId)
                        .orElseThrow(() -> new RuntimeException("Clinic not found with ID: " + locationId));
                schedule.setClinic(clinic);
                schedule.setHospital(null);
            } else {
                throw new IllegalArgumentException("Invalid locationType: " + locationType);
            }

            // Handle createdAt if provided
            Object createdAtObj = scheduleData.get("createdAt");
            if (createdAtObj != null && scheduleId == null) {
                try {
                    LocalDateTime createdAt = LocalDateTime.parse(createdAtObj.toString());
                    schedule.setCreatedAt(Timestamp.valueOf(createdAt));
                } catch (Exception e) {
                    schedule.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
                }
            } else if (scheduleId == null) {
                schedule.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
            }

            // Save or update the schedule
            doctorScheduleRepository.save(schedule);
        }
    }

    public List<DoctorSchedule> getDoctorScheduleWithLocations(Long doctorId) {
        System.out.println("Fetching schedules for Doctor ID: " + doctorId);
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctor_IdWithLocations(doctorId);
        return schedules != null ? schedules : new ArrayList<>();
    }

    public List<Map<String, Object>> getDoctorLocations(Long doctorId) {
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctorId(doctorId);
        List<Map<String, Object>> locations = new ArrayList<>();

        for (DoctorSchedule schedule : schedules) {
            Map<String, Object> locationData = new HashMap<>();
            if (schedule.getHospital() != null) {
                locationData.put("name", schedule.getHospital().getName());
                locationData.put("type", "hospital");
            } else if (schedule.getClinic() != null) {
                locationData.put("name", schedule.getClinic().getName());
                locationData.put("type", "clinic");
            }
            locationData.put("schedule", schedule.getDayOfWeek().name() + " " +
                    schedule.getStartTime() + " - " + schedule.getEndTime());
            locations.add(locationData);
        }
        return locations;
    }
}