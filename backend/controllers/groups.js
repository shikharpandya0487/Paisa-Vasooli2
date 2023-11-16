import mongoose from "mongoose";
import user from "../models/user.js"
import group from "../models/group.js";
import bcrypt from "bcryptjs";
import  jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { validationResult } from "express-validator";

export const  creategroup= async(req,res)=>{
    const {userId,title} = req.body.groupInput
        const newgroup = new group(
            req.body.groupInput
        );
    try {
        console.log(userId)
        newgroup.members.push(userId)
        const updatedgroup = await group.findByIdAndUpdate(
            newgroup._id,
            {$push:{members:userId}},
            {new:true}
        )
        const userr = await user.findByIdAndUpdate(
            userId,
            { $push: { groups: newgroup._id } },
            { new: true }
        );
        await newgroup.save()
        res.status(200).json({newgroup})
    }
    catch (err) {
    next(err)
    console.log(err);
    }
};

export const joingroup = async(req,res)=>{
    const {userId,JoingCode} = req.body.joincode
    const existgroup = await group.findOne({groupCode:JoingCode});
    if (!existgroup) {
        return res.status(404).json({ error: 'Group not found' });
    }
    if (existgroup.members.includes(userId)) {
        return res.status(400).json({ error: 'User is already a member of this group' });
    }
    const newgroup = await group.findByIdAndUpdate(
            existgroup._id,
            {$push:{members:userId}},
            {new:true}
        )
    const userr = await user.findByIdAndUpdate(
        userId,
        { $push: { groups: existgroup._id } },
        { new: true }
    );
    const updatedGroup = await newgroup.save();
    res.status(200).json(updatedGroup);
}

export const getgroups = async(req,res)=>{
    const userId= req.params.id;
    // console.log(req.params.userId)
    try{
        // const groups = await group.find({
        //     $or:[
        //     {members: { $in: userId }},{userId: userId},],})
        console.log(userId)
        const userr = await user.findById(userId)
        const allgroups = userr.groups
        // res.json({allgroups})
        const groupDetails = await Promise.all(allgroups.map(async groupId => {
            const groupDetail = await group.findById(groupId);
            return groupDetail;
          }));
        res.json( groupDetails );
    }catch(err){
        console.log(err)
    }
}

export const getmembers = async(req,res)=>{
    const groupId= req.params.id;
    // console.log(req.params.userId)
    try{
        // const groups = await group.find({
        //     $or:[
        //     {members: { $in: userId }},{userId: userId},],})
        console.log(groupId)
        const groupweneed= await group.findById(groupId)
        const allmembers = groupweneed.members
        // res.json({allgroups})
        const memberDetails = await Promise.all(allmembers.map(async userId => {
            const memberDetail = await user.findById(userId);
            return memberDetail;
          }));
        res.json( memberDetails );
    }catch(err){
        console.log(err)
    }
}
export const splitBill = async (req, res) => {
    const { amount, groupData } = req.body.input;
    const n = groupData.members.length;
  
    try {
      const billSplit = await Promise.all(
        groupData.members.map(async (mem) => {
          const { username } = await user.findById(mem);
          return {
            amount: amount / n,
            name: username,
            userId: mem,
            settled: false,
          };
        })
      )
      const updatedgroup = await group.findByIdAndUpdate(
        groupData._id,
        {$push:{billSplit:billSplit}},
        {new:true}
       )
  
      res.json(updatedgroup);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  export const markPaid = async (req, res) => {
    // Group id
    const id = req.params.id;
    // User id
    const userId = req.body.userId;

    try {
        const group1 = await group.findById(id);

        // Find the index of the user in the billSplit array
        const userIndex = group1.billSplit[0].findIndex((mem) => mem.userId === userId);

        // If the user is found, update the settled field
        if (userIndex !== -1) {
            // Convert the string to a boolean and toggle it
            group1.billSplit[0][userIndex].settled = group1.billSplit[0][userIndex].settled === 'true' ? 'false' : 'true';
            await group1.save();
        }

        res.json(group1);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

