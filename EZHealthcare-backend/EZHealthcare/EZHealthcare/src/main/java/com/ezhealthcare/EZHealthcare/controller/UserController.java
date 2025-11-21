package com.ezhealthcare.EZHealthcare.controller;

import com.ezhealthcare.EZHealthcare.model.Doctor;
import com.ezhealthcare.EZHealthcare.model.User;
import com.ezhealthcare.EZHealthcare.repository.UserRepository;
import com.ezhealthcare.EZHealthcare.repository.DoctorRepository;
import com.ezhealthcare.EZHealthcare.security.*;
import com.ezhealthcare.EZHealthcare.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    private final UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.findUserById(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @RequestParam("fullName") String fullName,
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("age") int age,
            @RequestParam("gender") String gender,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        try {
            User user = userService.findUserById(userId);

            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            user.setFullName(fullName);
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setAge(age);
            user.setGender(gender);



            User updatedUser = userService.updateUser(userId, user);
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }






    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok().body(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error deleting user: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        System.out.println("Register request received!");
        System.out.println("User data: " + user);

        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(registeredUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/user-login")
    public ResponseEntity<?> userLogin(@RequestBody AuthRequest authRequest) {
        try {
            System.out.println("Regular user login attempt for username: " + authRequest.getUsername());
            System.out.println("Password provided: " + authRequest.getPassword());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtils.generateJwtToken(authentication);

            Optional<User> user = userRepository.findByUsername(authRequest.getUsername());
            if (user.isPresent()) {
                System.out.println("User found in database: " + user.get().getId());
                return ResponseEntity.ok(new AuthResponse(token, user.get().getId()));
            } else {
                System.out.println("User not found in database after authentication - this should not happen");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found after authentication");
            }

        } catch (BadCredentialsException e) {
            System.out.println("Bad credentials for user: " + authRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody AuthRequest authRequest) {
        try {
            System.out.println("Admin login attempt for username: " + authRequest.getUsername());
            System.out.println("Password provided: " + authRequest.getPassword());

            if ("admin".equals(authRequest.getUsername()) && "admin".equals(authRequest.getPassword())) {
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword(),
                        List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN"))
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
                String token = jwtUtils.generateJwtToken(authentication);
                System.out.println("Admin login successful");
                return ResponseEntity.ok(new AuthResponse(token, -1L));
            } else {
                System.out.println("Invalid admin credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Admin login failed: " + e.getMessage());
        }
    }

    @PostMapping("/doctor-login")
    public ResponseEntity<?> doctorLogin(@RequestBody DoctorAuthRequest authRequest) {
        try {
            System.out.println("Received email: " + authRequest.getEmail());
            System.out.println("Received password: " + authRequest.getPassword());

            Optional<Doctor> doctorOpt = doctorRepository.findByEmail(authRequest.getEmail());

            if (doctorOpt.isPresent()) {
                Doctor doctor = doctorOpt.get();
                System.out.println("Doctor found: " + doctor.getEmail());
                System.out.println("Stored plain password: " + doctor.getPassword());

                if (!authRequest.getPassword().equals(doctor.getPassword())) {
                    System.out.println("Password does not match");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials");
                }

                String token = jwtUtils.generateJwtTokenForDoctor(doctor.getEmail(), doctor.getId());
                return ResponseEntity.ok(new DoctorAuthResponse(token, doctor.getId()));
            } else {
                System.out.println("No doctor found with email: " + authRequest.getEmail());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Doctor login failed: " + e.getMessage());
        }
    }
}