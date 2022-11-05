declare module "express-session" {
   interface SessionData {
      online?: boolean;
      [k: string]: any;
   }
}
 
export {}
