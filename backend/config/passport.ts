import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { userService } from '../services/user.service';
import type { User } from '../../shared/schema';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        const isValid = await userService.verifyPassword(password, user.password);
        if (!isValid) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await userService.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
