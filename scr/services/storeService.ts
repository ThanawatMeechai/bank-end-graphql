import { OkPacket, RowDataPacket, Connection } from "mysql2/promise";

import { Store } from "../models/store";
import {  getConnection } from "../dbconfig/dbconfig";
import jwt from "jsonwebtoken";

export const getStore = async (args: { id: number }, token: string): Promise<Store | undefined> => {
    try {
      // ตรวจสอบ token
      const decoded: any = jwt.verify(token, 'testtest'); 
  
      // ถ้า token ถูกต้อง, ดำเนินการดึงข้อมูล store
      const connection: Connection = await getConnection();
      const [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM store WHERE id = ?",
        [args.id]
      );
  
      return rows[0] as Store | undefined;
    } catch (error) {
      console.error("Error in getStore:", error);
      throw new Error("Invalid token or unauthorized access");
    }
  };
  
  export const createStore = async (args: { input: Store }): Promise<Store> => {
    const { name, price, image } = args.input;
    const connection: Connection = await  getConnection()
  
    try {
      // Hash the password
    //   console.log("register_username:", username);
    //   console.log("register_password:", password);


      const [existingUser] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM store WHERE name = ?",
        [name]
      );
  
      if (existingUser.length > 0) {
        throw new Error("name store already in use");
      }
      const [result] = await connection.execute<OkPacket>(
        "INSERT INTO store (name, price, image) VALUES (?, ?, ?)",
        [name, price, image]
      );
  
      const [rows] = await connection.execute<RowDataPacket[]>(
        "SELECT * FROM store WHERE id = ?",
        [result.insertId]
      );
  
      return rows[0] as Store;
    } catch (error) {
      console.error("Error in createStore:", error);
      throw new Error("Store creation failed. Please try again.");
    } finally {

      await connection.end();
    }
  };