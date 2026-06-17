/**
 * Tipos de la base de datos (placeholder permisivo).
 *
 * En el Bloque 2 ya existen las migraciones; podés generar los tipos exactos con:
 *   npx supabase gen types typescript --project-id <id> > src/types/db.ts
 *
 * Mientras tanto este tipo satisface el `GenericSchema` que espera supabase-js
 * (con índices abiertos) para que .from()/.insert()/.update() no se degraden a
 * `never` y la app compile sin tipos generados.
 */
type FilaGenerica = {
  Row: { [columna: string]: any };
  Insert: { [columna: string]: any };
  Update: { [columna: string]: any };
  Relationships: [];
};

type FuncionGenerica = {
  Args: { [arg: string]: any };
  Returns: any;
};

export type Database = {
  public: {
    Tables: { [tabla: string]: FilaGenerica };
    Views: { [vista: string]: FilaGenerica };
    Functions: { [funcion: string]: FuncionGenerica };
    Enums: { [nombre: string]: string };
    CompositeTypes: { [nombre: string]: { [campo: string]: any } };
  };
};
