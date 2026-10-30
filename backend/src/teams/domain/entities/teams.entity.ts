import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskEntity } from '../../../tasks/domain/entities/tasks.entity';

@Entity('teams')
export class TeamEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 100 })
    name: string;

    @Column('varchar', { length: 7 })
    colorHex: string;

    @Column('varchar', { length: 200, nullable: true })
    description?: string;

    @OneToMany(() => TaskEntity, (task) => task.team)
    tasks: TaskEntity[];
}
