import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  async getId(user_uuid: string): Promise<string> {
    return (
      await this.userRepository.findOne({
        where: { user_uuid },
        select: ["user_id"],
      })
    ).user_id;
  }

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async fetchUser(user_id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { user_id } });
  }

  async getUserByUUID(user_uuid: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { user_uuid } });
  }

  async updateUser(user: UserEntity): Promise<UserEntity> {
    const { user_uuid } = user;
    await this.userRepository.update({ user_uuid }, user);
    return await this.userRepository.findOne({
      where: { user_uuid },
    });
  }



}
