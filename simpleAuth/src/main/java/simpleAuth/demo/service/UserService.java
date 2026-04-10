package simpleAuth.demo.service;

import org.springframework.stereotype.Service;
import simpleAuth.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import simpleAuth.demo.model.User;

import org.springframework.security.crypto.password.PasswordEncoder;
import simpleAuth.demo.config.JwtUtil;
@Service
public class UserService {
  @Autowired
  private UserRepository userRepository;
  @Autowired
  private PasswordEncoder passwordEncoder;
  @Autowired
  private JwtUtil jwtUtil;


  public User saveUser(User user){
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return userRepository.save(user);
  }
  
  public String login(String email, String password) {

    User user = userRepository.findByEmail(email);

    if (user == null) {
      throw new RuntimeException("User not found");
    }

   if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid password");
   }
    return jwtUtil.generateToken(email);
  }
  
}
