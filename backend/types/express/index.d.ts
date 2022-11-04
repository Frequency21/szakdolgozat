declare namespace Express {
   interface Request {
      user?: import('src/user/entities/user.entity').User;
   }

}
