import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { RiDeleteBinFill } from "@remixicon/react";

export function DialogDelete({ onDelete }: { onDelete: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive"><RiDeleteBinFill className="size-4"/></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Usuario</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          ¿Estás seguro de que quieres eliminar este usuario?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onDelete}>Confirmar</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}