import { useSQLiteContext } from "expo-sqlite";

export type UserDB = {
  id: number;
  name: string;
  email: string;
  pass: string;
}

export function useUserDB() {

  const db = useSQLiteContext();

  async function criar(data: Omit<UserDB, "id">) {
    const statment = await db.prepareAsync(
      "INSERT INTO users (name, email, pass) VALUES ($name, $email, $pass)"
    )

    try{
      const result = await statment.executeAsync({
        $name: data.name,
        $email: data.email,
        $pass: data.pass
      })
    } catch (error: any) {
      if (error.message?.includes("Unique constraint failed: users.email")){
        throw new Error("Este e-mail ja esta cadastrado.")
      }
    } finally {
      await statment.finalizeAsync()
    }

  }

  async function buscaEM(email: string): Promise<UserDB | null> {
        const query = "SELECT * FROM users WHERE email = $email";

        const user = await db.getFirstAsync<UserDB>(query, { $email: email });
        
        return user ?? null;
    }

  
  return{criar, buscaEM}
}
