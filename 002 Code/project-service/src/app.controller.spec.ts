import { Test, type TestingModule } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
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
import { GetDetailWorkResponse, GetWorksResponse } from '@/responses';

describe('AppController', () => {
    let controller: AppController;
    let service: MockProxy<AppService>;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        })
            .overrideProvider(AppService)
            .useValue(mock<AppService>())
            .compile();

        controller = app.get<AppController>(AppController);
        service = app.get(AppService);
    });

    describe('findAll', () => {
        it('GetWorksResponse를 반환한다.', async () => {
            const works: PreviewWorkDto[] = [
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

            const expected: GetWorksResponse = {
                works,
            };

            const mockFindAll = service.findAll.mockResolvedValue(works);

            const actual = await controller.findAll();

            expect(actual).toEqual(expected);
            expect(mockFindAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
        it('GetDetailWorkResponse를 반환한다.', async () => {
            const id = 'uuid1';

            const work: WorkDto = {
                id: 'uuid1',
                name: 'name1',
                team_name: 'teamName1',
                members: [
                    {
                        name: 'member1',
                        extra: 'is good',
                    },
                ],
                pdf_url: 'pdf.pdf',
                description: 'description',
                main_url: 'https://github.com',
                year: 2025,
            };

            const expected: GetDetailWorkResponse = {
                work,
            };

            const mockFindById = service.findById.mockResolvedValue(work);

            const actual = await controller.findById(id);

            expect(actual).toEqual(expected);
            expect(mockFindById).toHaveBeenCalledWith(id);
            expect(mockFindById).toHaveBeenCalledTimes(1);
        });
    });

    describe('create', () => {
        it('AppService.create를 호출한다.', async () => {
            const createWorkBody: CreateWorkBody = {
                name: 'name',
                team_name: 'teamName1',
                members: [
                    {
                        name: 'member1',
                        extra: 'is good',
                    },
                ],
                description: 'description',
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

            const mockCreate = service.create.mockResolvedValue();

            await controller.create(createWorkBody, createWorkFile);

            expect(mockCreate).toHaveBeenCalledWith(createWorkDto);
            expect(mockCreate).toHaveBeenCalledTimes(1);
        });
    });

    describe('update', () => {
        it('AppService.update를 호출한다.', async () => {
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

            const updateWorkDto: UpdateWorkFile = new UpdateWorkDto(
                id,
                updateWorkBody,
                updateWorkFile,
            );

            const mockUpdate = service.update.mockResolvedValue();

            await controller.update(id, updateWorkBody, updateWorkFile);

            expect(mockUpdate).toHaveBeenCalledWith(updateWorkDto);
            expect(mockUpdate).toHaveBeenCalledTimes(1);
        });
    });

    describe('remove', () => {
        it('AppService.remove를 호출한다.', async () => {
            const id = 'uuid1';

            const removeWorkDto: RemoveWorkDto = {
                id,
            };

            const mockRemove = service.remove.mockResolvedValue();

            await controller.remove(id);

            expect(mockRemove).toHaveBeenCalledWith(removeWorkDto);
            expect(mockRemove).toHaveBeenCalledTimes(1);
        });
    });
});
