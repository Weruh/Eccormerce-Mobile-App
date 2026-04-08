import { verifyWebhook } from "@clerk/express/webhooks"
import { Request, Response } from "express"
import User from "../models/User.js"

export const clerkWebhooks =  async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req)
    
    // Handle user deleted event
    if (evt.type === "user.deleted") {
      await User.deleteOne({ clerkId: evt.data.id })
      return res.json({ success: true, message: "User deleted" })
    }
    
    // Build user data safely
    const email = evt.data?.email_addresses?.[0]?.email_address || "";
    const firstName = evt.data?.first_name || "";
    const lastName = evt.data?.last_name || "";
    const name = `${firstName} ${lastName}`.trim() || "";
    
    const userData = {
        clerkId: evt.data.id,
        email: email || undefined,
        name: name || undefined,
        image: evt.data?.image_url,
    }
    
    // Use upsert to handle create/update in one operation
    await User.findOneAndUpdate(
        { clerkId: evt.data.id },
        userData,
        { upsert: true, new: true }
    )

    return res.json({ success: true, message: "webhook received" })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return res.status(400).send('Error verifying webhook')
  }
}