import jwt from 'jsonwebtoken';
import { TokenEnum } from '../../constants/constants';

class JwtHelper {
  static ExtractToken(token: string, type: TokenEnum): any {
    try {
      const secret = type === TokenEnum.access 
        ? process.env.JWT_SECRET 
        : process.env.JWT_REFRESH_SECRET;
        
      return jwt.verify(token, secret as string);
    } catch (error) {
      return null;
    }
  }
}

export default JwtHelper; 