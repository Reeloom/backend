import axios from 'axios';
import { INSTAGRAM_AUTH } from '@/shared/constants/auth';
import { OAUTH } from '@/shared/constants/oauth';

export interface InstagramTokenResponse {
  access_token: string;
  user_id: string;
}

export interface InstagramUserInfo {
  id: string;
  username: string;
  account_type?: string;
}

export class InstagramAuthService {
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: INSTAGRAM_AUTH.CLIENT_ID,
      redirect_uri: INSTAGRAM_AUTH.REDIRECT_URI,
      scope: INSTAGRAM_AUTH.SCOPES.join(','),
      response_type: OAUTH.INSTAGRAM.RESPONSE_TYPE,
    });
    return `${OAUTH.INSTAGRAM.AUTH_URL}?${params.toString()}`;
  }

  async getTokens(code: string): Promise<InstagramTokenResponse> {
    const { data } = await axios.post(OAUTH.INSTAGRAM.TOKEN_URL, null, {
      params: {
        client_id: INSTAGRAM_AUTH.CLIENT_ID,
        client_secret: INSTAGRAM_AUTH.CLIENT_SECRET,
        grant_type: OAUTH.INSTAGRAM.GRANT_TYPE,
        redirect_uri: INSTAGRAM_AUTH.REDIRECT_URI,
        code,
      },
    });
    return data;
  }

  async getUserInfo(accessToken: string): Promise<InstagramUserInfo> {
    const { data } = await axios.get(OAUTH.INSTAGRAM.USERINFO_URL, {
      params: {
        fields: 'id,username,account_type',
        access_token: accessToken,
      },
    });
    return data;
  }
}
