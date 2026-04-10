package simpleAuth.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import simpleAuth.demo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
  // User findByEmail(String email);
  User findByEmail(String email);
} 
  