import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, CronOptions } from '@nestjs/schedule';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case';

@Injectable()
export class CleanupTasksJob {
    private readonly logger = new Logger(CleanupTasksJob.name);
    constructor(private readonly deleteTaskUseCase: DeleteTaskUseCase) {}
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
        timeZone: 'America/Sao_Paulo',
    })
    async execute(): Promise<void> {
        this.logger.log('Starting cleanup of tasks with due dates...');
        await this.deleteTaskUseCase.deleteAllDueDateTasks();
        this.logger.log('Cleanup of tasks with due dates completed.');
    }
}
