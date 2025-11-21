package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.model.*;
import com.ezhealthcare.EZHealthcare.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.*;

@Service
public class DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;
    @Autowired
    private SpecialtyRepository specialtyRepository;
    @Autowired
    private ClinicRepository clinicRepository;
    @Autowired
    private DoctorClinicsRepository doctorClinicsRepository;
    @Autowired
    private DoctorHospitalsRepository doctorHospitalsRepository;

    private final String uploadDir = "uploads/doctors/";

    public DoctorService() {
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory for doctors!", e);
        }
    }

    @Transactional
    public Doctor createDoctor(Map<String, Object> doctorData, MultipartFile image) {
        try {
            Doctor doctor = new Doctor();
            doctor.setName((String) doctorData.get("name"));
            doctor.setPhoneNumber((String) doctorData.get("phoneNumber"));
            doctor.setEmail((String) doctorData.get("email"));
            doctor.setDegree((String) doctorData.get("degree"));
            doctor.setExperience((String) doctorData.get("experience"));
            doctor.setPassword((String) doctorData.get("password"));
            doctor.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            // Handle specialty
            @SuppressWarnings("unchecked")
            Map<String, Object> specialtyMap = (Map<String, Object>) doctorData.get("specialty");
            Long specialtyId = Long.parseLong(String.valueOf(specialtyMap.get("id")));
            doctor.setSpecialty(specialtyRepository.findById(specialtyId)
                    .orElseThrow(() -> new RuntimeException("Specialty not found")));

            doctor.setHospitals(new HashSet<>());
            doctor.setClinics(new ArrayList<>());
            doctor.setDoctorHospitals(new HashSet<>());
            doctor.setDoctorClinics(new ArrayList<>());

            // Save doctor first
            Doctor savedDoctor = doctorRepository.save(doctor);

            // Handle hospitals and their schedules
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> hospitals = (List<Map<String, Object>>) doctorData.get("hospitals");
            if (hospitals != null) {
                for (Map<String, Object> hospitalData : hospitals) {
                    Long hospitalId = Long.parseLong(String.valueOf(hospitalData.get("id")));
                    Hospital hospital = hospitalRepository.findById(hospitalId)
                            .orElseThrow(() -> new RuntimeException("Hospital not found"));

                    savedDoctor.getHospitals().add(hospital);

                    @SuppressWarnings("unchecked")
                    List<Map<String, String>> schedules = (List<Map<String, String>>) hospitalData.get("schedules");
                    if (schedules != null) {
                        schedules.stream()
                                .filter(scheduleData ->
                                        scheduleData.get("startTime") != null &&
                                                !scheduleData.get("startTime").isEmpty() &&
                                                scheduleData.get("endTime") != null &&
                                                !scheduleData.get("endTime").isEmpty())
                                .forEach(scheduleData -> {
                                    DoctorHospitals doctorHospital = new DoctorHospitals();
                                    doctorHospital.setDoctor(savedDoctor);
                                    doctorHospital.setHospital(hospital);
                                    doctorHospital.setDay(scheduleData.get("day").toUpperCase());
                                    doctorHospital.setStartTime(scheduleData.get("startTime"));
                                    doctorHospital.setEndTime(scheduleData.get("endTime"));
                                    savedDoctor.getDoctorHospitals().add(doctorHospital);
                                    doctorHospitalsRepository.save(doctorHospital);

                                    DoctorSchedule schedule = new DoctorSchedule();
                                    schedule.setDoctor(savedDoctor);
                                    schedule.setHospital(hospital);
                                    schedule.setDayOfWeek(DayOfWeek.valueOf(scheduleData.get("day").toUpperCase()));
                                    schedule.setStartTime(Time.valueOf(LocalTime.parse(scheduleData.get("startTime"))));
                                    schedule.setEndTime(Time.valueOf(LocalTime.parse(scheduleData.get("endTime"))));
                                    schedule.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                                    doctorScheduleRepository.save(schedule);
                                });
                    }
                }
            }

            // Handle clinics and their schedules
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> clinics = (List<Map<String, Object>>) doctorData.get("clinics");
            if (clinics != null) {
                for (Map<String, Object> clinicData : clinics) {
                    Long clinicId = Long.parseLong(String.valueOf(clinicData.get("id")));
                    Clinic clinic = clinicRepository.findById(clinicId)
                            .orElseThrow(() -> new RuntimeException("Clinic not found"));

                    savedDoctor.getClinics().add(clinic);

                    @SuppressWarnings("unchecked")
                    List<Map<String, String>> schedules = (List<Map<String, String>>) clinicData.get("schedules");
                    if (schedules != null) {
                        schedules.stream()
                                .filter(scheduleData ->
                                        scheduleData.get("startTime") != null &&
                                                !scheduleData.get("startTime").isEmpty() &&
                                                scheduleData.get("endTime") != null &&
                                                !scheduleData.get("endTime").isEmpty())
                                .forEach(scheduleData -> {
                                    DoctorClinics doctorClinic = new DoctorClinics();
                                    doctorClinic.setDoctor(savedDoctor);
                                    doctorClinic.setClinic(clinic);
                                    doctorClinic.setDay(scheduleData.get("day").toUpperCase());
                                    doctorClinic.setStartTime(scheduleData.get("startTime"));
                                    doctorClinic.setEndTime(scheduleData.get("endTime"));
                                    savedDoctor.getDoctorClinics().add(doctorClinic);
                                    doctorClinicsRepository.save(doctorClinic);

                                    DoctorSchedule schedule = new DoctorSchedule();
                                    schedule.setDoctor(savedDoctor);
                                    schedule.setClinic(clinic);
                                    schedule.setDayOfWeek(DayOfWeek.valueOf(scheduleData.get("day").toUpperCase()));
                                    schedule.setStartTime(Time.valueOf(LocalTime.parse(scheduleData.get("startTime"))));
                                    schedule.setEndTime(Time.valueOf(LocalTime.parse(scheduleData.get("endTime"))));
                                    schedule.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                                    doctorScheduleRepository.save(schedule);
                                });
                    }
                }
            }

            // Handle image upload if provided
            if (image != null && !image.isEmpty()) {
                try {
                    String imagePath = saveImage(image);
                    savedDoctor.setImage(imagePath);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload image: " + e.getMessage());
                }
            }

            return doctorRepository.save(savedDoctor);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error creating doctor: " + e.getMessage());
        }
    }

    public Map<String, Object> getDoctorWithLocations(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Hospital> hospitals = hospitalRepository.findByDoctors_Id(doctorId);
        List<Clinic> clinics = clinicRepository.findByDoctors_Id(doctorId);

        Map<String, Object> response = new HashMap<>();
        response.put("doctor", doctor);
        response.put("hospitals", hospitals);
        response.put("clinics", clinics);

        return response;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAllWithSpecialty(); // Fetch doctors with specialties
    }

    public List<Doctor> getDoctorsBySpecialty(Long specialtyId) {
        return doctorRepository.findBySpecialtyId(specialtyId);
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public List<Doctor> searchDoctors(String query, Long hospitalId, Long clinicId) {
        List<Doctor> doctors;

        if (query == null && hospitalId == null && clinicId == null) {
            return doctorRepository.findAll();
        }

        // Start with base query
        doctors = doctorRepository.searchDoctors(query, hospitalId, clinicId);

        return doctors;
    }

    public Set<String> getScheduleLocations() {
        List<DoctorSchedule> allSchedules = doctorScheduleRepository.findAll();
        Set<String> locations = new HashSet<>();
        for (DoctorSchedule schedule : allSchedules) {
            if (schedule.getHospital() != null) {
                locations.add(schedule.getHospital().getName());
            } else if (schedule.getClinic() != null) {
                locations.add(schedule.getClinic().getName());
            }
        }
        return locations;
    }

    @Transactional
    public Doctor updateDoctor(
            Long id,
            String name,
            String phoneNumber,
            String email,
            String specialization,
            String degree,
            String experience,
            List<Long> hospitalIds,
            List<Long> clinicIds,
            MultipartFile image,
            String[] schedulesJson) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));

        if (name != null && !name.trim().isEmpty()) doctor.setName(name);
        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            if (phoneNumber.matches("^\\d{10,12}$")) {
                doctor.setPhoneNumber(phoneNumber);
            } else {
                throw new RuntimeException("Invalid phone number: must be 10-12 digits");
            }
        }
        if (email != null && !email.trim().isEmpty()) {
            if (email.matches("^[\\w-.]+@[\\w-]+\\.[\\w-]+$")) {
                doctor.setEmail(email);
            } else {
                throw new RuntimeException("Invalid email format");
            }
        }
        if (degree != null && !degree.trim().isEmpty()) doctor.setDegree(degree);
        if (experience != null && !experience.trim().isEmpty()) {
            try {
                int exp = Integer.parseInt(experience);
                if (exp >= 0) doctor.setExperience(experience);
                else throw new RuntimeException("Experience must be a non-negative number");
            } catch (NumberFormatException e) {
                throw new RuntimeException("Experience must be a number");
            }
        }

        if (specialization != null && !specialization.trim().isEmpty()) {
            Specialty specialtyEntity = specialtyRepository.findByName(specialization)
                    .orElseGet(() -> {
                        Specialty newSpecialty = new Specialty();
                        newSpecialty.setName(specialization);
                        return specialtyRepository.save(newSpecialty);
                    });
            doctor.setSpecialty(specialtyEntity);
        }

        if (hospitalIds != null) {
            Set<Hospital> hospitals = new HashSet<>();
            for (Long hospitalId : hospitalIds) {
                Hospital hospital = hospitalRepository.findById(hospitalId)
                        .orElseThrow(() -> new RuntimeException("Hospital not found: " + hospitalId));
                hospitals.add(hospital);
            }
            if (hospitals.size() <= 3) {
                doctor.setHospitals(hospitals);
            } else {
                throw new RuntimeException("Maximum of 3 hospitals allowed");
            }
        }

        if (clinicIds != null) {
            List<Clinic> clinics = new ArrayList<>();
            for (Long clinicId : clinicIds) {
                Clinic clinic = clinicRepository.findById(clinicId)
                        .orElseThrow(() -> new RuntimeException("Clinic not found: " + clinicId));
                clinics.add(clinic);
            }
            if (clinics.size() <= 3) {
                doctor.setClinics(clinics);
            } else {
                throw new RuntimeException("Maximum of 3 clinics allowed");
            }
        }

        if (image != null && !image.isEmpty()) {
            try {
                // Delete old image if exists
                if (doctor.getImage() != null) {
                    deleteImage(doctor.getImage());
                }
                String imagePath = saveImage(image);
                doctor.setImage(imagePath); // Store only the filename, e.g., "uuid_susu.jpg"
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }

        return doctorRepository.save(doctor);
    }

    private String saveImage(MultipartFile image) throws IOException {
        String originalName = image.getOriginalFilename();
        String fileName = UUID.randomUUID() + "_" + originalName; // Unique filename
        Path filePath = Paths.get(uploadDir + fileName);
        Files.copy(image.getInputStream(), filePath);
        return fileName; // Return just the filename
    }

    private void deleteImage(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir + fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image: " + e.getMessage());
        }
    }
}