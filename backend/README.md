# FUBlogHub Backend

FUBlogHub for FPT student

# To run the project

- Clone the project
- Config .env file
- Run `npm install`
- Run `npm build`
- Run `npm run dev`

# Swagger

- Default: http://localhost:4000/api-docs/

# Features

- Fundamental of Express: routing, middleware, sending response and more
- Fundamental of Mongoose: Data models, data validation and middleware
- RESTful API including pagination,sorting and limiting fields
- CRUD operations with MongoDB
- Security: encyption, sanitization and more
- Authentication with JWT : login and signup
- Authorization (User roles and permissions)
- Error handling
- Enviroment Varaibles
- handling error outside Express
- Catching Uncaught Exception

# Project Structure

- server.js : Responsible for connecting the MongoDB and starting the server.
- app.js : Configure everything that has to do with Express application.
- config.env: for Enviroment Varaiables
- routes -> userRoutes.js: The goal of the route is to guide the request to the correct handler function which will be in one of the controllers
- controllers -> userController.js: Handle the application request, interact with models and send back the response to the client
- models -> userModel.js: (Business logic) related to business rules, how the business works and business needs ( Creating new user in the database, checking if the user password is correct, validating user input data)

aggregate
// const blogWithTags = await Blog.aggregate([
// {
// $lookup: {
// from: "blogtags", // Tên của collection cho BlogTag model
// localField: "_id", // Trường trong collection "Blog" để so khớp
// foreignField: "blogId", // Trường trong collection "BlogTag" để so khớp
// as: "tags", // Tên của trường trong kết quả là "tags"
// },
// },
// {
// $unwind: "$tags", // Mở rộng các kết quả từ trường "tags"
// },
// {
// $lookup: {
// from: "tags", // Tên của collection cho Tag model
// localField: "tags.tagId", // Trường trong collection "BlogTag" để so khớp với _id trong collection "Tag"
// foreignField: "_id",
// as: "tags.tagInfo", // Tên của trường trong kết quả là "tagInfo"
// },
// },
// {
// $group: {
// _id: "$_id", // Gom nhóm kết quả theo _id của Blog
// tags: {
// $push: {
// _id: "$tags.tagInfo._id",
// name: "$tags.tagInfo.name",
// }, // Đưa thông tin của các Tag vào một mảng "tags"
// },
// // Bạn có thể thêm các trường khác của Blog vào đây nếu cần
// },
// },
// {
// $project: {
// _id: 1,
// tags: 1,
// // Bạn có thể chọn các trường của Blog mà bạn muốn bao gồm ở đây
// },
// },
// ]);

    // Gộp kết quả từ 2 mảng trên lại với nhau
    // lấy tag gắn qua, nếu lấy theo index mà id của blog với id của blogtag khác nhau thì find lại
    // const result = blogPopulate.map((blog: any, index: any) => {
    //   let blogTag = blogWithTags[index];

    //   if (blogTag._id.toString() !== blog._id.toString()) {
    //     blogTag = blogWithTags.find(
    //       (item: any) => item._id.toString() === blog._id.toString()
    //     );
    //   }

    //   return {
    //     ...blog._doc,
    //     tags: blogTag.tags,
    //   };
    // });
