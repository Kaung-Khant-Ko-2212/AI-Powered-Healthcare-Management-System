package com.ezhealthcare.EZHealthcare.service;

import com.ezhealthcare.EZHealthcare.controller.DuplicateEmailException;
import com.ezhealthcare.EZHealthcare.controller.DuplicateUsernameException;
import com.ezhealthcare.EZHealthcare.model.Appointment;
import com.ezhealthcare.EZHealthcare.model.User;
import com.ezhealthcare.EZHealthcare.repository.AppointmentRepository;
import com.ezhealthcare.EZHealthcare.repository.NotificationRepository;
import com.ezhealthcare.EZHealthcare.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationRepository notificationRepository;

    @Autowired
    public UserService(
            UserRepository userRepository,
            AppointmentRepository appointmentRepository,
            PasswordEncoder passwordEncoder,
            NotificationRepository notificationRepository
    ) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public void deleteUser(Long userId) {
        notificationRepository.deleteByUserId(userId);
        List<Appointment> appointments = appointmentRepository.findByUserIdOrderByAppointmentDateDescAppointmentTime(userId);
        for (Appointment appointment : appointments) {
            notificationRepository.deleteByAppointmentId(appointment.getId());
        }
        appointmentRepository.deleteByUserId(userId);
        userRepository.deleteById(userId);
    }

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateEmailException("Email '" + user.getEmail() + "' is already taken.");
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateUsernameException("Username '" + user.getUsername() + "' is already taken.");
        }

        try {
            if (user.getPassword() != null) {
                String hashedPassword = passwordEncoder.encode(user.getPassword());
                user.setPassword(hashedPassword);
                System.out.println("Registering user: " + user.getUsername() + ", Hashed Password: " + hashedPassword);
            }
            return userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw ex;
        }
    }

    public User findUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User updateUser(Long userId, User user) {
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser != null) {
            existingUser.setFullName(user.getFullName());
            existingUser.setUsername(user.getUsername());
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
            existingUser.setAge(user.getAge());
            existingUser.setGender(user.getGender());
            return userRepository.save(existingUser);
        }
        return null;
    }



    public String saveProfileImage(Long userId, MultipartFile profileImage) throws IOException {
        String uploadDir = "uploads/profile-images/";
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = "user_" + userId + "_" + System.currentTimeMillis() +
                "." + getFileExtension(profileImage.getOriginalFilename());
        Path filePath = uploadPath.resolve(fileName);

        Files.write(filePath, profileImage.getBytes());

        return "/profile-images/" + fileName;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "jpg";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }
}