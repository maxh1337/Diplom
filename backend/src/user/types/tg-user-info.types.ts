export interface ITelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username: string;
  language_code: string;
  allows_write_to_pm: true;
  photo_url: string;
}
