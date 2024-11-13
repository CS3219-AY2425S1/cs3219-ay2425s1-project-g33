import { UpdateUserDto } from 'src/dto/update-user.dto';

export interface UpdateUserPayload {
  userId: string;
  updateUserDto: UpdateUserDto;
}
