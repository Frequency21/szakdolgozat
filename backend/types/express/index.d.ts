declare namespace Express {
   interface Request {
      user?: import('src/user/user.entity').User;
   }
}
