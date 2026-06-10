const cron = require("node-cron");
const axios = require("axios");
const Task = require("./models/task");

cron.schedule("0 9 * * *", async () => {

    console.log("Checking deadlines...");

    try {

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const start = new Date(tomorrow.setHours(0,0,0,0));
        const end = new Date(tomorrow.setHours(23,59,59,999));

        const tasks = await Task.find({
            deadline: {
                $gte: start,
                $lte: end
            },
            status: { $ne: "Completed" }
        });

        for (const task of tasks) {

            await axios.post(process.env.SLACK_WEBHOOK_URL, {
                text:
`⏰ Deadline Reminder

📝 Task: ${task.title}
📅 Deadline: Tomorrow
⚠ Please complete the task on time.`
            });

        }

    } catch (error) {
        console.log(error.message);
    }

});