import { google, Auth } from 'googleapis';
import { GOOGLE_AUTH } from '@/shared/constants/auth';
import { OAUTH } from '@/shared/constants/oauth';

export interface GoogleUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export class GoogleAuthService {
  private oauth2Client: Auth.OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      GOOGLE_AUTH.CLIENT_ID,
      GOOGLE_AUTH.CLIENT_SECRET,
      GOOGLE_AUTH.REDIRECT_URI,
    );
  }

  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: OAUTH.GOOGLE.ACCESS_TYPE,
      scope: GOOGLE_AUTH.SCOPES,
      prompt: OAUTH.GOOGLE.PROMPT,
    });
  }

  async getTokens(code: string): Promise<Auth.Credentials> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  async getUserInfo(tokens: Auth.Credentials): Promise<GoogleUserInfo> {
    this.oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
    const { data } = await oauth2.userinfo.get();
    return {
      id: data.id || '',
      email: data.email || '',
      name: data.name ?? undefined,
      picture: data.picture ?? undefined,
    };
  }
}
