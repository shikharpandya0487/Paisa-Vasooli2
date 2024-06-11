import User from "../models/user.js"

export const addStock = async(req,res)=>{
    const stock = req.body
    const userId = req.params.userId
    console.log(userId,stock)
    try{
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { stocks: stock } },
            { new: true }
        );

        res.status(200).json({ message: 'Stock added successfully', user });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const getStocks = async(req,res)=>{
    const userId = req.params.userId
    try{
        const user = await User.findById(userId);
        const val=user.stocks;
        res.status(200).json({ message: 'Stocks retrieved successfully', val });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const deleteStock = async (req, res) => {
    try{
        const userId = req.params.userId;
        const { input } = req.body;
        console.log(input);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const stockIndex = user.stocks.findIndex(stock => stock.input.toLowerCase() === input.toLowerCase());
        if (stockIndex > -1) {
            user.stocks.splice(stockIndex, 1);
            await user.save();
            return res.status(200).json({ message: 'Stock deleted successfully', user });
        } else {
            return res.status(404).json({ message: 'Stock not found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getUrls = async(req,res)=>{
    const userId = req.params.userId
    try{
        const user = await User.findById(userId);
        const files=user.files;

        res.status(200).json({ message: 'Stocks retrieved successfully', files });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const addUrl = async(req,res)=>{
    const {url,fileName} = req.body
    const userId = req.params.userId
    console.log(userId,url)
    try{
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { files: {fileName:fileName,url:url} } },
            { new: true }
        );

        res.status(200).json({ message: 'file added successfully', user });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
export const addImg = async(req,res)=>{
    const {url} = req.body
    const userId = req.params.userId
    console.log(userId,url)
    try{
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { image: url } },
            { new: true }
        );
        res.status(200).json({ message: 'image added successfully', user });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getInbox = async(req,res)=>{
    const {userId} = req.params
    try{
        const user=await User.findById(userId)
        res.json({inbox:user.inbox})
    }catch(err){
        res.json("user not found")
    }
}

export const addBadge=async(req,res)=>{
    const image = req.body.img
    const userId = req.params.id
    console.log(userId,image)
    try{
        // const usere =  await User.findById(userId);
        // if (usere.badges.includes(image)) {
        //     return res.status(400).json({ message: 'This badge already exists' });
        // }
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { badges: image } },
            { new: true } 
        );
       
        // console.log(user)
        res.status(200).json({ user });

    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getBadges=async(req,res)=>{
    const userId = req.params.id
    console.log(userId);
    try{
        const user = await User.findById(userId)
        const badges = user.badges;
        res.status(200).json({ badges });
    }catch(err){
        console.error(err);
    }
}