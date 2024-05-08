import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    const usersCollection = await users();

    const userIds = {
        secretServiceMember: new ObjectId(),
        patrickHill: new ObjectId(),
        barrackoliObama: new ObjectId(),
        sandeep: new ObjectId(),
        tacoboy76: new ObjectId(),
        drizzydrakefan123: new ObjectId(),
        jakefromstatefarm: new ObjectId(),
        georgeWashington: new ObjectId(),
        ghengisKhan: new ObjectId(),
    };
    
    const userData = [
        {
            _id: userIds.secretServiceMember,
            email: "pjhugzqabpmfylnism@cazlv.com",
            password: "$2b$16$WmjAhvFacdJVYqs6Ql.OQOLSHJxpBe4Srf4mnXBIOf6VDUxjFZwW.",
            refresh_token: "AQBnckAWns3iLdHTFqlqfCFHtgalK8_qyXgf2AnlbVV25yEVFBRMtExfeUrlUXCPZzZwSenMR6zTClfkUbeYGj3fGvhTgzzkQUFzGChb8xpEhGhjlcT5SSu9OJSWnwLP58o",
            profile_picture: [],
            username: "secret service member",
            spotifyId: "31azu27jcxreo7kfdw4y42tbklqa",
            friends: [userIds.patrickHill.toString()],
            friendRequests: []
        },
        {
            _id: userIds.patrickHill,
            email: "jakell.trayon@milkgitter.com",
            password: "$2b$16$oHBtnaXgPhn/o43svrP2TepT1o/6qQNkFXs8wyugsUN/k2Hwk.Scm",
            refresh_token: "AQDLHSa35TdmGLshidWQVWC9-SeQwvCAyk5olwoM2elBOUHEGo9WLLLu69d2L0oJxzK6PC8zhEGtSCtN48dxFzvJKFhM8XEO9AmOBj2N5ZZHpWDBNEvTTh56MPpVtIApaZo",
            profile_picture: [],
            username: "Patrick Hill",
            spotifyId: "31hzr2pgash2mfrvgmtz4fvzgoji",
            friends: [userIds.secretServiceMember.toString(), userIds.barrackoliObama.toString(), userIds.ghengisKhan.toString(), userIds.georgeWashington.toString()],
            friendRequests: [userIds.jakefromstatefarm.toString(),userIds.tacoboy76.toString()]
        },
        {
            _id: userIds.barrackoliObama,
            email: "wbt46758@ilebi.com",
            password: "$2b$16$sftlX9FsPVdb5OeceyJPVeSd1MfU/79akd/7pbp14Vjn1kvRwv/5.",
            refresh_token: "AQDgoYZ4yAJ2Y2bZHQ_VENpMNOpLNxZF1ZO32QqxVs5V4-_S916OidenaivA-JL9rmFoQRTPhsHSUiaPZpjjajl2vXFBm4hQI2-YF2utwEM6P_BWRYK5hVC9Ou9J2gtn3Vo",
            profile_picture: [],
            username: "Barrackoli Obama",
            spotifyId: "31x7an4cmslxmwiwemggdrvvj5si",
            friends: [userIds.patrickHill.toString(), userIds.sandeep.toString()],
            friendRequests: []
        },
        {
            _id: userIds.sandeep,
            email: "gcy87433@fosiq.com",
            password: "$2b$16$uOFVDlWuss2o/vt4ccgrauiwzTpZ3Xvzag/ng35W8JQfnSSRvpgDu",
            refresh_token: "AQBBCJUTbyZK_MrQlRdvMP3GLIhup2UZ8cRd21ahn4YJCOdB38mB2fggZPNJoUI4xRT1eBe5pp7AGCdymIp9_8X8d-B2sf7qg5sGY1f1m2LiYHtBHMGDWsGMXLUdAWexpKU",
            profile_picture: [],
            username: "Sandeep",
            spotifyId: "313wkjijex45xwumdq3fgly2rkl4",
            friends: [userIds.barrackoliObama.toString()],
            friendRequests: []
        },
        {
            _id: userIds.tacoboy76,
            email: "ggt24265@vogco.com",
            password: "$2b$16$tAGPXPM0fOFInG9amX16QOw2alKxAHd8F7p7NuGyX1pxuSezFH6Ou",
            refresh_token: "AQATc3WLsKx1vDPRQXwHbSeAoPdHWSZm1GINI9k4rlNbJgi8os-ohabt_n5qiOzDvs3nZ-sKm4mSiS-aI03A-YkuP8b3UWDoWYXITbATGCtoYJcUoLv312QoXhNAilsDvEU",
            profile_picture: [],
            username: "Tacoboy76",
            spotifyId: "31gas7wqqbyj7xk3mk4vbv63zdtu",
            friends: [],
            friendRequests: []
        },
        {
            _id: userIds.drizzydrakefan123,
            email: "enm02655@ilebi.com",
            password: "$2b$16$jz3wcGZS/tScmZh7sKfaoO023JKAzOEhYaAEJOZ3t.1qZiMrwDkEq",
            refresh_token: "AQAMsTwzyzwbIoM6Fgsrh1mjQhtuFnVVtUomow19qwVOkRcVEK9hn1Cnmj95281_zqTfQRG6Ib7BQlhlqoqWBYGr2GW5Hvx1JfujTUZJ2BNKAVLATOnN7LtejXPhw0Iq8pg",
            profile_picture: [],
            username: "drizzydrakefan123",
            spotifyId: "31uejdfgjnv4wxihxufsofcar6my",
            friends: [userIds.georgeWashington.toString()],
            friendRequests: []
        },
        {
            _id: userIds.jakefromstatefarm,
            email: "nkd60045@fosiq.com",
            password: "$2b$16$raqJXUJ10h.AJsDkm/Rc/e4l1iRnxUSncJTo8dpjNkX9pnQsYS.dC",
            refresh_token: "AQDpJa-DhMT_tTeCA0PeJQJRdLHx3_dxHvadyDAwMJPsclVXBiuegoXSPne9CdhzExuH5z2W_LwG4xe94q9Hnz06HDV1OzXkxvFnAuKrI2rlvj26-QjoquQT4akrFGrtz2g",
            profile_picture: [],
            username: "jakefromstatefarm",
            spotifyId: "31tzu7uhq4utz67hdul4avbfogzi",
            friends: [userIds.ghengisKhan.toString()],
            friendRequests: []
        },
        {
            _id: userIds.georgeWashington,
            email: "nmf42861@fosiq.com",
            password: "$2b$16$z/faSTCfaahMxZL5JqH16un7hrS9IdoXuHOygBL4lnpQKSUnXNNuC",
            refresh_token: "AQCgJY3KxDySGNwT-GT69CN5KD-wwBSzl_xa0zrVsXv3DNf36GD7qQ9_r5pV-ew5wJMNGWbMPBe7m3KmOrNLQ7QSJ6oCj46696rXorRvm4ISdkkMEf9brxUeOt9Si0-IOJ0",
            profile_picture: [],
            username: "George Washington",
            spotifyId: "31yt3neswp6xybr7zytj66m32rvy",
            friends: [userIds.patrickHill.toString(), userIds.drizzydrakefan123()],
            friendRequests: []
        },
        {
            _id: userIds.ghengisKhan,
            email: "gpi04167@ilebi.com",
            password: "$2b$16$d5hz5DIiGUJc8/c3TjrMFug2GWSHTJ5AjnKx.6hB44ylAhvgONoR.",
            refresh_token: "AQCDxtAEIOSTHLd3uPrgsxppnG4MbwR76y01hX4-OrUkGB3jv1P8BfDO7CGqv3atj7jIRTAz7Ihi4P-bu6zUGy7aGr4mwGEHBHR7K7gTwA_VF6to5tq5-MvTIBg3Kj92oSA",
            profile_picture: [],
            username: "Ghengis Khan",
            spotifyId: "31v2vkdhotuqhgnagezzt5c7yscm",
            friends: [userIds.patrickHill.toString(),  userIds.jakefromstatefarm.toString()],
            friendRequests: []
        }
    ];

    await usersCollection.insertMany(userData);

    console.log('Done seeding database');
    await closeConnection();
};

main().catch(console.log);
