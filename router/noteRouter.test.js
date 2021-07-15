const NoteRouter = require("./noteRouter")

describe("Note router function tests", () => {

    var noteService;
    var noteRouter;
    let response;

    beforeEach(() => {
        noteService = {
            list: jest.fn().mockResolvedValue(true),
            add: jest.fn().mockResolvedValue(true),
            edit: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
        }

        noteRouter = new NoteRouter(noteService)

        response = {
            status: jest.fn().mockResolvedValue(200),
            json: () => {
                return "Error";
            },
            redirect: () => {
                return "Working"
            }
        }
    })

    test("Call list in response to get request", (done) => {
        noteRouter.get({
            auth: {
                user: "Candice",
            },
        }, response)
        expect(noteService.list).toHaveBeenCalled();
        done();
    })

    test("Call add in response to post method", (done) => {
        noteRouter.post({
            auth: {
                user: "Kelvin",
            },
            body: {
                note: "test note "
            }
        }, response)
        expect(noteService.add).toHaveBeenCalled();
        done();
    })

    test("Call edit in response to the put method", (done) => {
        noteRouter.put({
            auth: {
                user: "Kelvin"
            },
            body: {
                note: "testing note"
            },
            params: {
                id: 0
            }
        }, response)
        expect(noteService.edit).toHaveBeenCalledWith("testing note", "Kelvin", 0);
        done()
    })

    test("Call delete in response to delete method", (done) => {
        noteRouter.delete({
            auth: {
                user: "Kelvin"
            },
            params: {
                id: 0
            }
        }, response)
        expect(noteService.delete).toHaveBeenCalledWith("Kelvin", 0);
        done()
    })
})