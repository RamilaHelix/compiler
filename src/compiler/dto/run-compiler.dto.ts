import { IsNotEmpty } from "class-validator";
export class CompileProgramDto {

    @IsNotEmpty()
    script: string;

    input: string;
}