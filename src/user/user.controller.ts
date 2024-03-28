import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';

import { JwtAuthGuard } from '@user/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@user/guards/local-auth.guard';
import { ColumnOwnershipGuard } from '@user/guards/column-ownership.guard';
import { CommentOwnershipGuard } from '@user/guards/comment-ownership.guard';

import { LoginUserDto } from '@user/dto/login-user.dto';
import { AddColumnDto } from '@user/dto/add-column.dto';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { CreateCardDto } from '@user/dto/create-card.dto';
import { UpdateCardDto } from '@user/dto/update-card.dto';
import { UpdateColumnDto } from '@user/dto/update-column.dto';
import { CreateCommentDto } from '@user/dto/create-comment.dto';
import { UpdateCommentDto } from '@user/dto/update-comment.dto';

import { UserEntity } from '@user/entities/user.entity';
import { ColumnEntity } from '@user/entities/column.entity';
import { CardEntity } from '@user/entities/card.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('User')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Login',
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async login(@Request() req) {
    return await this.userService.login(req.user);
  }

  @ApiTags('User')
  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Create user',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async register(@Body() dto: CreateUserDto) {
    return await this.userService.register(dto);
  }

  @ApiTags('User')
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get user by id',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getById(@Param('id') userId: number) {
    const user = await this.userService.getById(userId);

    if (!user) throw new NotFoundException('Пользователь не найден');

    const { password, ...result } = user;

    return result;
  }

  @ApiTags('User column')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @Get(':id/columns')
  @ApiResponse({
    status: 200,
    description: 'Get all user columns',
    type: [ColumnEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getColumns(@Param('id') userId: number, @Request() req) {
    if (req.user.userId == userId)
      return await this.userService.getColumns(userId);
    else throw new NotAcceptableException('Нет доступа');
  }

  @ApiTags('User column')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @Post(':id/columns')
  @ApiResponse({
    status: 200,
    description: 'Create column',
    type: AddColumnDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiBody({ type: AddColumnDto })
  async addColumn(@Param('id') userId: number, @Body() dto: AddColumnDto) {
    const user = await this.userService.getById(userId);

    if (!user) throw new NotFoundException('Пользователь не найден');

    return await this.userService.addColumn(userId, dto);
  }

  @ApiTags('User column')
  @UseGuards(JwtAuthGuard, ColumnOwnershipGuard)
  @ApiSecurity('bearer')
  @Delete(':id/columns/:columnId')
  @ApiResponse({
    status: 200,
    description: 'Delete column',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async deleteColumn(
    @Param('id') userId: number,
    @Param('columnId') columnId: number,
  ) {
    return await this.userService.deleteColumn(userId, columnId);
  }

  @ApiTags('User column')
  @UseGuards(JwtAuthGuard, ColumnOwnershipGuard)
  @ApiSecurity('bearer')
  @Patch(':id/columns/:columnId')
  @ApiBody({ type: UpdateColumnDto })
  @ApiResponse({
    status: 200,
    description: 'Update column',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async updateColumn(
    @Param('id') userId: number,
    @Param('columnId') columnId: number,
    @Body() dto: UpdateColumnDto,
  ) {
    return await this.userService.updateColumn(userId, columnId, dto);
  }

  @ApiTags('User column card')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @Get(':id/columns/:columnId/cards')
  @ApiResponse({
    status: 200,
    description: 'Get all user column cards',
    type: [CardEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async getCards(
    @Param('id') userId: number,
    @Param('columnId') columnId: number,
    @Request() req,
  ) {
    if (req.user.userId == userId)
      return await this.userService.getCards(userId, columnId);
    else throw new NotAcceptableException('Нет доступа');
  }

  @ApiTags('User column card')
  @UseGuards(JwtAuthGuard, ColumnOwnershipGuard)
  @ApiSecurity('bearer')
  @Post(':id/columns/:columnId')
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({
    status: 200,
    description: 'Create card',
    type: CreateCardDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async addCard(
    @Param('id') userId: number,
    @Param('columnId') columnId: number,
    @Body() dto: CreateCardDto,
  ) {
    return await this.userService.addCard(userId, columnId, dto);
  }

  @ApiTags('User column card')
  @UseGuards(JwtAuthGuard, ColumnOwnershipGuard)
  @ApiSecurity('bearer')
  @Delete(':id/columns/:columnId/cards/:cardId')
  @ApiResponse({
    status: 200,
    description: 'Delete card',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async deleteCard(
    @Param('id') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
  ) {
    return await this.userService.deleteCard(userId, cardId);
  }

  @ApiTags('User column card')
  @UseGuards(JwtAuthGuard, ColumnOwnershipGuard)
  @ApiSecurity('bearer')
  @Patch(':id/columns/:columnId/cards/:cardId')
  @ApiBody({ type: UpdateCardDto })
  @ApiResponse({
    status: 200,
    description: 'Update card',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async updateCard(
    @Param('id') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Body() dto: UpdateCardDto,
  ) {
    return await this.userService.updateCard(userId, cardId, dto);
  }

  @ApiTags('User column card comment')
  @UseGuards(JwtAuthGuard, ColumnOwnershipGuard)
  @ApiSecurity('bearer')
  @Post(':id/columns/:columnId/cards/:cardId')
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Create comment',
    type: CreateCommentDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async addComment(
    @Param('id') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Body() dto: CreateCommentDto,
  ) {
    return await this.userService.addComment(userId, cardId, dto);
  }

  @ApiTags('User column card comment')
  @UseGuards(JwtAuthGuard, ColumnOwnershipGuard, CommentOwnershipGuard)
  @ApiSecurity('bearer')
  @Delete(':id/columns/:columnId/cards/:cardId/comments/:commentId')
  @ApiResponse({
    status: 200,
    description: 'Delete comment',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async deleteComment(
    @Param('id') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
  ) {
    return await this.userService.deleteComment(userId, commentId);
  }

  @ApiTags('User column card comment')
  @UseGuards(JwtAuthGuard, ColumnOwnershipGuard, CommentOwnershipGuard)
  @ApiSecurity('bearer')
  @Patch(':id/columns/:columnId/cards/:cardId/comments/:commentId')
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({
    status: 200,
    description: 'Update comment',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async updateComment(
    @Param('id') userId: number,
    @Param('columnId') columnId: number,
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return await this.userService.updateComment(userId, commentId, dto);
  }
}
