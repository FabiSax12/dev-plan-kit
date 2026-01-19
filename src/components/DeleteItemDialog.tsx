import React from "react"
import { Button } from "./ui/button"
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog"

interface Props {
    onConfirm: () => void
    triggerContent?: (openModal: () => void) => React.ReactNode
}

export const DeleteItemDialog = ({ onConfirm, triggerContent }: Props) => {

    const [isOpen, setIsOpen] = React.useState(false)

    const handleConfirm = () => {
        setIsOpen(false)
        onConfirm()
    }

    return <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            {triggerContent?.(() => setIsOpen(true))}
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Item</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this item? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleConfirm}>Confirm</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}