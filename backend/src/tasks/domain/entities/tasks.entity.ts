import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TeamEntity } from '../../../teams/domain/entities/teams.entity';
export enum TaskStatus {
    PENDING = 'pendente',
    IN_PROGRESS = 'em progresso',
    COMPLETED = 'concluído',
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
        ],
        nullable: true,
        default: TaskStatus.PENDING,
    })
    status?: TaskStatus;

    @Column('timestamp', { nullable: true })
    dueDate?: Date;

    @ManyToMany(() => TeamEntity, (team) => team.tasks, {
        onDelete: 'RESTRICT',
    })
    @JoinTable({
        name: 'task_teams',
        joinColumn: { name: 'taskId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'teamId', referencedColumnName: 'id' },
    })
    teams: TeamEntity[];
}
