import express, { Request, Response } from "express";
import { CacheProvider, CacheType } from "../../src/cache/cache.provider";
import { v4 as uuidv4 } from "uuid";
import { authenticateWalletUser } from "../utils/eth";

declare module "express-session" {
  export interface SessionData {
    isAuthenticated: boolean;
  }
}

const router = express.Router();

const addressCache = CacheProvider.getCache(CacheType.AddressCache);

const getUserRepo = async (): Promise<UserRepository> => {
  return (await RepositoryFactory.getInstance()).getUserRepository();
};

router.get(
  "/nonce/:pubkey",
  (req: Request<{ pubkey: string }>, res: Response<{ nonce: string }>) => {
    const nonce = uuidv4();
    addressCache.set(req.params.pubkey, nonce);
    res.send({ nonce });
  }
);

router.post(
  "/login",
  async (
    req: Request<{}, {}, { pubkey: string; signedmsg: string }>,
    res: Response<User>
  ) => {
    const pubkey = req.body.pubkey;
    const signedMsg = req.body.signedmsg;
    const nonce = addressCache.get(pubkey);

    //authenticate user through his wallet address
    // const userIsAuthd = authenticateWalletUser(pubkey, signedMsg, nonce);
    const userIsAuthd = true;

    if (userIsAuthd) {
      res.cookie("isAuthenticated", true, {
        maxAge: req.session.cookie.maxAge,
        httpOnly: false,
      });
      res.status(200).send(user);
    } else {
      //login fail
      console.error(`could not login...`);
      res.status(401).send();
    }
  }
);

export default router;
