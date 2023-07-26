import fastifyPassport from "@fastify/passport";
// @ts-ignore
import { Strategy as LocalStrategy } from "passport-local";

// @ts-ignore
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const jwtConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "deneme",
};

export const setupAuth = () => {
  fastifyPassport.use(
    "jwt",
    new JwtStrategy(jwtConfig, async (jwtPayload: any, done: Function): Promise<void> => {
      try {
        console.log("user geldi");
        // const user = await UserService.userTokenIsValid(jwtPayload);
        const user = {};

        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        console.log("test");

        done(error);
      }
    })
  );
  fastifyPassport.registerUserSerializer(async (user: any) => console.log("ee gel"));

  fastifyPassport.registerUserDeserializer(async (id: number) => {
    console.log("ool please");

    // return await User.findByPk(id);
  });
};
