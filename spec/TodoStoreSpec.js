describe("TodoStore", function() {
    var KEY = "angular2-todos";
    var TodoStore = require('../app/services/store').TodoStore;
    var Todo = require('../app/services/store').Todo;
    var store;

    beforeAll(function(){
        var dumStore = {};
        localStorage = {
            getItem: function(key) {
                return dumStore[KEY];
            },
            setItem: function(key, value) {
                dumStore[KEY] = value;
            },
            get length() {
                return Object.keys(dumStore).length;
            },
            clear: function(){
                dumStore = {};
            },
            get todoCount() {
                return JSON.parse(dumStore[KEY]).length;
            }
        };
    });

    beforeEach(function() {
        store = new TodoStore();
    });

    describe("#add", function() {
        afterEach(function(){
            localStorage.clear();
        });
        it("should add todo", function() {
            store.add("foo");
            
            var expected = new Todo("foo");
            var actual = store.todos[0];
            expect(actual).toEqual(expected);
            expect(store.todos.length).toEqual(1);
        });
        it("should not add an empty todo", function() {
            store.add("");
            expect(store.todos.length).toEqual(0);
        });
        it("should not add a duplicate todo", function() {
            store.add("foo");
            store.add("bar");
            store.add("foo");
            
            var expected = [ new Todo("foo"), new Todo("bar") ];
            var actual = store.todos;

            expect(actual).toEqual(expected);
            expect(store.todos.length).toEqual(2);
        });
    });

    describe("#remove", function() {
        afterEach(function(){
            localStorage.clear();
        });
        it("should remove existing todo", function(){
            var actualFoo;
            var actualBar;

            store.add("foo");

            actualFoo = store.todos[0];
            store.remove(actualFoo);
            expect(store.todos.length).toEqual(0);

            store.add("foo");
            store.add("bar");
            
            actualFoo = store.todos[0];
            actualBar = store.todos[1];
            store.remove(actualFoo);
            
            expect(store.todos.length).toEqual(1);
            expect(store.todos[0]._title).toEqual("bar");
        });
        it("should not change todos list if todo does not exist", function(){
            var bar = new Todo("bar");
            
            store.add("foo");
            store.remove(bar);

            expect(store.todos.length).toEqual(1);
            expect(store.todos[0]._title).toEqual("foo");
        });
        it("should do nothing if todos is empty", function(){
            var foo = new Todo("foo");

            expect(function(){ store.remove(foo) }).not.toThrow();
        });
    });

    afterAll(function(){
        localStorage = null;
    })
});