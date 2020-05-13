<!-- ![Ironhack logo](https://i.imgur.com/1QgrNNw.png)

# Mongoose&Express | Simple CRUD
  -->

## Learning Goals

After this lesson, you will be able to:

- Create new documents on the database with data from a form filled by a user
- Update documents in the database
- Delete documents from the database
-

## Introduction

Continuing our `library-project` example, integrating and mixing the concepts we learned during the second module, in the following learning unit we will see how we can create, update and delete documents mix of available technologies - Mongoose, MongoDB, and Express.

**C**reate, **R**ead, **U**pdate, and **D**elete are essential parts of any web application, and for sure will be part of our second project.

In this lesson, we will use the same project - our _library app_.

## Create new documents

In our example, we will create new books and store them in our database.

:::info
**Two important questions:**
<br>

- Which routes you shall build to enable users to create new documents in the books collection?
  - a route to display a form where a user can fill in the book info
  - a route to process user's inputs and create a new book in the database.
- Which methods will you use on each of those routes?
  - GET to display the form to user(s) and
  - POST to process user's inputs and save them in the database.
    :::

So let's proceed to create two new routes: the first one to render the form where the user can fill in all the info about a new book, and the second one for processing the data about the book and saving the new book to the database.

Here are the routes you will be using:

| Route           | HTTP Verb | Description                  |
| --------------- | --------- | ---------------------------- |
| `/books/create` | GET       | Show a form to create a book |
| `/books/create` | POST      | Save a book to the database  |

Go ahead and create these routes in the `routes/book.routes.js` file:

```javascript
// routes/book.routes.js

// imports and GET routes to list all the books
// and book details stay untouched

// GET route to display the form
router.get('/books/create', (req, res) => res.render('book-create'));

// POST route to save new book to the database
router.post('/books/create', (req, res) => {
  // ... some code goes here
});
```

Awesome! Now we need to add a form on the `book-create.hbs` file, with all the fields we need to create a new book.

```hbs
{{!-- book-create.hbs --}}

<h2>Create a book</h2>

<form action="/books/create" method="post">

  <label for="title-input">Title:</label>
  <input type="text" name="title" id="title-input" />

  <label for="author-input">Author:</label>
  <input type="text" name="author" id="author-input" />

  <label for="description-input">Description:</label>
  <textarea name="description" id="description-input" cols="30" rows="4"> </textarea>

  <label for="rate-input">Rate:</label>
  <input type="number" name="rating" id="rate-input" min="1" max="10" />

  <button type="submit">Create</button>

</form>
```

### Process the data from the form and save a new document in the database

When a user fills in the book info in the form and clicks on the _"Create"_ button, the data can be accessed in the POST route through the _request.body_ object thanks to the _body-parser_ npm package

Go ahead and add just `console.log(req.body)` in the POST route `/books/create` and after submitting the form, check the terminal console.

```javascript
// routes/book.routes.js
// ...

router.post('/books/create', (req, res) => {
  console.log(req.body);
});
```

You might see something like this:

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_c7f5299d8c0c8188d0553a154d99feac.png)

As we can see, all the data will be included in the `body` property of the `request` object, so we can use it to create a new book in the database.

1. Usually, the first step is to store the data into new variables. ES6 destructuring will help with that:

```javascript
// routes/book.routes.js
// ...

router.post('/books/create', (req, res) => {
  // console.log(req.body);
  const { title, author, description, rating } = req.body;
});
```

However, keep in mind that this is possible only if variables have the value of the _"name"_ attribute in the form the same as the properties in the schema.

![](https://s3-eu-west-1.amazonaws.com/ih-materials/uploads/upload_0f38a8141950a6018fc4394008393399.png)

2. We can create a new `Book` using the _Book_ model, which we have already imported. The cleanest way would be utilizing the `.create()` Mongoose method. If everything goes ok, we will receive the `book` object - the book that has been just saved. Otherwise, we will get an error back. We have to make sure both options are taken care of.

```javascript
// routes/book.routes.js
// ...

router.post('/books/create', (req, res) => {
  // console.log(req.body);
  const { title, author, description, rating } = req.body;

  Book.create({ title, author, description, rating })
    .then(bookFromDB => console.log(`New book created: ${bookFromDB.title}.`))
    .catch(error => `Error while creating a new book: ${error}`);
});
```

If we check the terminal now, we will see:

```shell
New book created: Ana Karenina.
```

3. Finally, we can redirect our user to the `/books` view, where we list all the books we have in the database. The new book should be already there. We should have the following code in the POST `/books/create` route:

```javascript
// routes/book.routes.js
//...

router.post('/books/create', (req, res) => {
  const { title, author, description, rating } = req.body;

  Book.create({ title, author, description, rating })
    .then(() => res.redirect('/books'))
    .catch(error => `Error while creating a new book: ${error}`);
});
```

Now we should see the new book we just created!

Creating new documents in the database is a pretty common action in web applications. This being said, make sure you fully understand it since you will definitely need it. If there is anything not clear enough, now it is the perfect time to ask! :wink:

## Update existing documents

Our users should be able to add books to our `library-project`. Users should be able to see the list of books, as well as the details page of every book individually. Our next step is to enable users to update books. Let's add this feature to our project!

### Edit Form

First, we need an edit form. But this is not a simple blank form. We need this form to be pre-filled with existing information saved in the database. To be able to pre-fill the form, we need to query a database for each specific book our user wants to update. This might raise a question, how do we know which book the user wants to edit.

**There are two ways we can pass the info about the book user is trying to edit:**

- Through _route params_. We can set a route similar to the following: `/book/edit/:id`. Being in such form, we can access to the `id` through the `req.params`.
- Through _query wtring_. Another option is to set the route: `/book/edit?bookId={{_id}}` and pass the data as a query string using the `?`. Now we could access the `id` through the `req.query`.

There is no major difference in which way you choose. We will go for the _route params_ approach.
This being said, here are the routes you will be using:

| Route             | HTTP Verb | Description                             |
| ----------------- | --------- | --------------------------------------- |
| `/books/:id/edit` | GET       | Show a pre-filled form to update a book |
| `/books/:id/edit` | POST      | Save the updated book to the database   |

1. Let's first add the _"Edit"_ option for each book. Go ahead and add the link to each book in the `books-list.hbs` file:

```hbs
{{!-- books-list.hbs --}}

<h1>Books</h1>
<hr>

{{#each books}}
  <div>
    <h3>{{title}}</h3>
    <a href="/books/{{_id}}">See details</a>
    <a href="/books/{{_id}}/edit">Edit</a> {{!-- <-- add this line  --}}
  </div>
  <hr>
{{/each}}
```

Great! Now, each book has a specific link containing the _book id_ that can be captured and used in the route to query a database and get a document from the database.

2. Let's create a GET route `/books/:id/edit` in the `routes/book.routes.js` file:

```javascript
// routes/book.routes.js
//...

router.get('/books/:id/edit', (req, res) => {
  const { id } = req.params;

  Book.findById(id)
    .then(bookToEdit => {
      console.log(bookToEdit);
    })
    .catch(error =>
      console.log(`Error while getting a single book for edit: ${error}`)
    );
});
```

For now, we are only outputting the `bookToEdit` (which is just a very descriptive placeholder; you can use any word instead). We can see that a different book will be outputted in the terminal console every time depending on which book we want to update. We can now proceed to the next step.

3. Let's create a new view with the edit form: `book-edit.hbs`. Before we proceed to create the form, let's first render this view and pass to it the _book_ object we queried from the database based on its _id_. The `id` will be _dynamic_, meaning, it will change depending on the book we want to update.

```javascript
// routes/book.routes.js
//...

router.get('/books/:id/edit', (req, res) => {
  const { id } = req.params;

  Book.findById(id)
    .then(bookToEdit => {
      // console.log(bookToEdit);
      res.render('book-edit', bookToEdit); // <-- add this line
    })
    .catch(error =>
      console.log(`Error while getting a single book for edit: ${error}`)
    );
});
```

Now we can create the _pre-filled_ form in the `book-edit.hbs` file:

```hbs
{{!-- books-edit.hbs --}}

<h2>Edit the book: {{title}}</h2>

<form action="/books/{{_id}}/edit" method="post">

  <label for="title-input">Title:</label>
  <input type="text" name="title" id="title-input" value="{{title}}" />

  <label for="author-input">Author:</label>
  <input type="text" name="author" id="author-input" value="{{author}}" />

  <label for="description-input">Description:</label>
  <textarea name="description" id="description-input" cols="30" rows="4">{{description}} </textarea>

  <label for="rate-input">Rate:</label>
  <input type="number" name="rating" id="rate-input" min="1" max="10" value="{{rating}}" />

  <button type="submit">Save changes</button>

</form>
```

As we can see, our form is rendering and each input field is pre-filled with the current value. We can now proceed to the POST route part. In the POST route, we have to gather all the values from the form (after the user makes changes and submits the form) and save them to the database. With this, we are not creating a new document but update the existing one, and this being said, we can use `.findByIdAndUpdate()` Mongoose method to accomplish this goal.

4. Create a POST route

We have to create a POST route that will match form `action` attribute (`/books/{{_id}}/edit`):

```javascript
// routes/book.routes.js
//...

router.post('/books/:id/edit', (req, res) => {
  const { id } = req.params;
  const { title, description, author, rating } = req.body;

  Book.findByIdAndUpdate(
    id,
    { title, description, author, rating },
    { new: true }
  )
    .then(updatedBook => res.redirect(`/books/${updatedBook._id}`))
    .catch(error =>
      console.log(`Error while updating a single book: ${error}`)
    );
});
```

_Side note_: Alternatively, you could achieve the same result with `.findOneAndUpdate()` Mongoose method.

#### Get the updated document

After updating the document, **Mongoose** returns us the old document from the database. This is pretty confusing, but there is an explanation for this behavior. If we don't specify the value of the option `new` to `true`, MongoDB server assumes its value is _false_ by default. That is why we can pass the third parameter to the `.findByIdAndUpdate()` Mongoose method. Setting up the `new` option to `true` so MongoDB server returns the updated document. The full syntax looks like this:

```javascript
Model.findByIdAndUpdate(req.params.theId, req.body, { new: true })
  .then()
  .catch();
```

## Delete existing documents

To round the full CRUD, under certain circumstances, users should be able to delete (destroy/remove) documents from the database.

Here is the route you will be using:

| Route               | HTTP Verb | Description                              |
| ------------------- | --------- | ---------------------------------------- |
| `/books/:id/delete` | POST      | Delete a specific book from the database |

As we can see, there is no GET route, but still, we need something to trigger this action. What we will create is a simple form, which will have the attribute `action` set to `/books/someBookId/delete` and method set to POST. Let's go to the `books-list.hbs`, and add the above-mentioned form:

```hbs
{{!-- books-list.hbs --}}

<h1>Books</h1>
<hr>

{{#each books}}
  <div>
    <h3>{{title}}</h3>
    <a href="/books/{{_id}}">See details</a>
    <a href="/books/{{_id}}/edit">Edit</a>
    <form action="/books/{{_id}}/delete" method="POST"> {{!-- <-- add the form  --}}
      <button>Delete</button>
    </form>
  </div>
  <hr>
{{/each}}
```

At this moment, if you would click on the _Delete_ button, you would be prompted with a 404 page. To fix this, go in the `routes/book.routes.js` file and add the POST route where this form should submit:

```javascript
// routes/book.routes.js
//...

router.post('/books/:id/delete', (req, res) => {
  const { id } = req.params;

  Book.findByIdAndDelete(id)
    .then(() => res.redirect('/books'))
    .catch(error => console.log(`Error while deleting a book: ${error}`));
});
```

And just like that, you have learned to create a full CRUD application. :clap:

## Summary

In this lesson, you have learned how to create, update, and delete documents using Express & Mongoose. This knowledge will be essential when it comes to developing the backend module project.
Just to summarize:

- To be able to create a new document in the database, you should:

  1. create a model;
  2. create form and using the GET route render it to users. The form needs to have two attributes: `action` pointing to a route and `method` which needs to have value `POST`;
  3. save the document in the database in the POST route from the form's `action` attribute. The values user inputted in the form input fields are accessible through the `req.body`. You can use `.create()` Mongoose method to actually save the new document in the database.

- To be able to update an existing document, you should:

  1. create a form and using the GET route render it to users. Make sure you query the database and retrieve the exact document you want to update based on its _`id`_. Pass the retrieved object to the form and pre-fill the form. The form needs to have two attributes: `action` pointing to a route and `method` which needs to have value `POST`;
  2. create the POST route that will match the form's `action` attribute. Using `req.body` fetch user's inputs. Using `.findByIdAndUpdate()`, update the document.

- To be able to delete an existing document, you should:
  1. create a simple form with usual attributes: `action` pointing to a route and `method` with the value `POST`. The form should only have a button.
  2. create the POST route that will match the form's `action` attribute. Use the value of the document's _`id`_ from `req.params` (or `req.query` alternatively) and pass it as an argument to the `.findByIdAndDelete()` Mongoose method.

Make sure you understand every step along this way since it is the base of this module.

## Extra Resources

- [Mongoose Create and Update](http://mongoosejs.com/docs/documents.html) - Official Docs
