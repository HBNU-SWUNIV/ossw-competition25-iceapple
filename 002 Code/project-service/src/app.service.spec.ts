import { Test, type TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { AppRepository } from '@/app.repository';
import { AppService } from '@/app.service';
import { SelectWork } from '@/database/table';
import {
    CreateWorkBody,
    CreateWorkDto,
    CreateWorkFile,
    PreviewWorkDto,
    RemoveWorkDto,
    UpdateWorkBody,
    UpdateWorkDto,
    UpdateWorkFile,
    WorkDto,
} from '@/dto';
import { WorkNotFoundException } from '@/exceptions';
import { AppMapper, FileManager } from '@/utils';

describe('AppService', () => {
    let service: AppService;
    let repository: MockProxy<AppRepository>;
    let mapper: AppMapper;
    let fileManager: MockProxy<FileManager>;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [AppService, AppRepository, AppMapper, FileManager],
        })
            .overrideProvider(AppRepository)
            .useValue(mock<AppRepository>())
            .overrideProvider(FileManager)
            .useValue(mock<FileManager>())
            .compile();

        service = app.get(AppService);
        repository = app.get(AppRepository);
        mapper = app.get(AppMapper);
    });

    describe('findAll', () => {
        const workEntities: SelectWork[] = [
            {
                id: 'uuid1',
                name: 'name1',
                team_name: 'teamName1',
                members: [
                    {
                        name: 'member1',
                        extra: 'is good',
                    },
                ],
                thumbnail: 'thumbnail1',
                pdf_url: 'pdf_url',
                description: 'description',
                main_url: 'https://github.com',
                created_at: new Date('2024'),
                year: 2025,
            },
        ];

        it('PreviewWorkDto 목록을 반환한다.', async () => {
            const expected: PreviewWorkDto[] = [
                {
                    id: 'uuid1',
                    name: 'name1',
                    members: [
                        {
                            name: 'member1',
                            extra: 'is good',
                        },
                    ],
                    thumbnail: 'thumbnail1',
                    year: 2025,
                },
            ];

            const mockFindAll =
                repository.findAll.mockResolvedValue(workEntities);

            const actual = await service.findAll();

            expect(actual).toEqual(expected);
            expect(mockFindAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
        const work: SelectWork = {
            id: 'uuid1',
            name: 'name1',
            team_name: 'teamName1',
            members: [
                {
                    name: 'member1',
                    extra: 'is good',
                },
            ],
            thumbnail: 'thumbnail1',
            pdf_url: 'pdf_url',
            description: 'description',
            main_url: 'https://github.com',
            created_at: new Date('2024'),
            year: 2025,
        };

        it('WorkDto를 반환한다.', async () => {
            const id = 'uuid1';
            const expected: WorkDto = {
                id: 'uuid1',
                name: 'name1',
                team_name: 'teamName1',
                members: [
                    {
                        name: 'member1',
                        extra: 'is good',
                    },
                ],
                pdf_url: 'pdf_url',
                description: 'description',
                main_url: 'https://github.com',
                year: 2025,
            };

            const mockFindById = repository.findById.mockResolvedValue(work);

            const actual = await service.findById(id);

            expect(actual).toEqual(expected);
            expect(mockFindById).toHaveBeenCalledWith(id);
            expect(mockFindById).toHaveBeenCalledTimes(1);
        });
    });

    describe('create', () => {
        it('AppRepository.create를 호출한다.', async () => {
            const createWorkBody: CreateWorkBody = {
                name: 'name',
                team_name: 'teamName1',
                description: 'description',
                members: [
                    {
                        name: 'member1',
                        extra: 'is good',
                    },
                ],
                main_url: 'https://github.com',
                year: 2025,
            };

            const createWorkFile: CreateWorkFile = {
                thumbnail: mock<Express.Multer.File>(),
                pdf: mock<Express.Multer.File>(),
            };

            const createWorkDto: CreateWorkDto = new CreateWorkDto(
                createWorkBody,
                createWorkFile,
            );

            const workEntity = mapper.toInsert(createWorkDto);

            const mockCreate = repository.create.mockResolvedValue();

            await service.create(createWorkDto);

            expect(mockCreate).toHaveBeenCalledWith(workEntity);
            expect(mockCreate).toHaveBeenCalledTimes(1);
        });
    });

    describe('update', () => {
        it('존재하지 않는 ID를 수정하려고 하는 경우 WorkNotFoundException을 던진다.', async () => {
            const id = 'uuid1';

            const removeWorkDto: RemoveWorkDto = {
                id,
            };

            const mockRemove = repository.remove.mockResolvedValue();
            repository.isExist.mockResolvedValue(false);

            await expect(service.remove(removeWorkDto)).rejects.toThrow(
                WorkNotFoundException,
            );
            expect(mockRemove).toHaveBeenCalledTimes(0);
        });

        it('수정 성공 시 AppRepository.update를 호출한다.', async () => {
            const id = 'uuid1';

            const updateWorkBody: UpdateWorkBody = {
                name: 'updated name',
                description: 'updated description',
                members: [
                    {
                        name: 'member1',
                        extra: 'is good',
                    },
                ],
                year: 2026,
            };

            const updateWorkFile: UpdateWorkFile = {
                thumbnail: mock<Express.Multer.File>(),
                pdf: mock<Express.Multer.File>(),
            };

            const updateWorkDto: UpdateWorkDto = new UpdateWorkDto(
                id,
                updateWorkBody,
                updateWorkFile,
            );

            const workEntity = mapper.toUpdate(updateWorkDto);

            const mockUpdate = repository.update.mockResolvedValue();
            repository.findById.mockResolvedValue({
                id: 'uuid1',
                name: 'name1',
                team_name: 'teamName1',
                members: [
                    {
                        name: 'member1',
                        extra: 'is good',
                    },
                ],
                thumbnail: 'thumbnail1',
                pdf_url: 'pdf_url',
                description: 'description',
                main_url: 'https://github.com',
                created_at: new Date('2024'),
                year: 2025,
            });

            await service.update(updateWorkDto);

            expect(mockUpdate).toHaveBeenCalledWith(workEntity);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
        });
    });

    describe('remove', () => {
        it('존재하지 않는 ID를 삭제하려고 하는 경우 WorkNotFoundException을 던진다.', async () => {
            const id = 'uuid1';

            const removeWorkDto: RemoveWorkDto = {
                id,
            };

            const mockRemove = repository.remove.mockResolvedValue();
            repository.findById.mockResolvedValue(null);

            await expect(service.remove(removeWorkDto)).rejects.toThrow(
                WorkNotFoundException,
            );
            expect(mockRemove).toHaveBeenCalledTimes(0);
        });

        it('삭제 성공시 AppRepository.remove를 호출한다.', async () => {
            const id = 'uuid1';

            const removeWorkDto: RemoveWorkDto = {
                id,
            };

            const mockRemove = repository.remove.mockResolvedValue();
            repository.findById.mockResolvedValue({
                id: 'uuid1',
                name: 'name1',
                team_name: 'teamName1',
                members: [
                    {
                        name: 'member1',
                        extra: 'is good',
                    },
                ],
                thumbnail: 'thumbnail1',
                pdf_url: 'pdf_url',
                description: 'description',
                main_url: 'https://github.com',
                created_at: new Date('2024'),
                year: 2025,
            });

            await service.remove(removeWorkDto);

            expect(mockRemove).toHaveBeenCalledWith(id);
            expect(mockRemove).toHaveBeenCalledTimes(1);
        });
    });
});
