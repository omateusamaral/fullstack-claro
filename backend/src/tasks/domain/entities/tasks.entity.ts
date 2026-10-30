import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TeamEntity } from '../../../teams/domain/entities/teams.entity';
export enum TaskStatus {
    PENDING = 'pendente',
    IN_PROGRESS = 'em progresso',
    COMPLETED = 'concluído',
    READY_FOR_DEVELOPMENT = 'pronta para desenvolvimento',
}

@Entity('tasks')
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 100 })
    title: string;

    @Column('varchar', { length: 200, nullable: true })
    description?: string;

    @Column('enum', {
        enum: [
            TaskStatus.PENDING,
            TaskStatus.IN_PROGRESS,
            TaskStatus.COMPLETED,
            TaskStatus.READY_FOR_DEVELOPMENT,
        ],
        nullable: true,
        default: TaskStatus.READY_FOR_DEVELOPMENT,
    })
    status?: TaskStatus;

    @Column('timestamp', { nullable: true })
    dueDate?: Date;

    @ManyToOne(() => TeamEntity, (team) => team.tasks, {
        nullable: false,
        onDelete: 'RESTRICT',
    })
    @JoinColumn({ name: 'teamId' })
    team: TeamEntity;
}
