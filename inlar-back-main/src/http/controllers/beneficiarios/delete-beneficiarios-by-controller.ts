import {
  Controller,
  HttpCode,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { DeleteBeneficiarioById } from 'src/inlar/actions/beneficiario/delete-beneficiario';
import { NotFoundError } from 'src/inlar/errors/not-found-error';
import { InternalError } from 'src/inlar/errors/internal-error';

// Definindo o esquema de validação
const schema = z.object({
  id_beneficiario: z.coerce.number(),
});

type Schema = z.infer<typeof schema>;
const validationPipe = new ZodValidationPipe(schema);

@Controller('/beneficiario') // Rota base sem o parâmetro de ID
export class DeleteBeneficiarioByIdController {
  constructor(private deleteBeneficiarioById: DeleteBeneficiarioById) {}

  @Delete(':id_beneficiario') // Parâmetro de ID movido para o decorador de rota
  @HttpCode(200)
  async handle(
    @Param(validationPipe) param: Schema,
  ) {
    const res = await this.deleteBeneficiarioById.execute({
      idBeneficiario: param.id_beneficiario,
    });

    if (res instanceof NotFoundError) {
      throw new NotFoundException(res.message);
    }

    if (res instanceof InternalError) {
      throw new BadRequestException('Internal Error');
    }

    if (res) {
      return res;
    }

    throw new BadRequestException();
  }
}
