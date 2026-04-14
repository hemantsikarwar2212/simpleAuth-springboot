package simpleAuth.demo.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import simpleAuth.demo.model.User;
import simpleAuth.demo.repository.UserRepository;

import java.io.IOException;

@Component
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private UserRepository userRepository;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication)
      throws IOException, ServletException {

    OAuth2User user = (OAuth2User) authentication.getPrincipal();

    String email = user.getAttribute("email");
    // Check if user exists
    User existingUser = userRepository.findByEmail(email);

    if (existingUser == null) {
      User newUser = new User();
      newUser.setEmail(email);
      newUser.setPassword("oauth_user"); // dummy
      userRepository.save(newUser);
    }

    //  Generate JWT
    String token = jwtUtil.generateToken(email);

    //  Redirect to frontend with token
    response.sendRedirect("http://localhost:5173/oauth-success?token=" + token);
  }
}