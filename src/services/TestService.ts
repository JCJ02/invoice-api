import TestRepo from "../repo/TestRepo";

class TestService {

    private testRepo;

    constructor() {

        this.testRepo = new TestRepo();

    }

    async index(data: { message: string }) {

        return await this.testRepo.index(data);

    }

}


export default TestService;