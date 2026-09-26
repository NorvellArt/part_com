import React, { useState, useEffect } from 'react';
import { Product, UpdateProductInput } from '@/domain/entities/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Package, Trash2, Edit3, Save, X } from 'lucide-react';

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (params: { id: string; data: UpdateProductInput }) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    isUpdating: boolean;
    isDeleting: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    product,
    isOpen,
    onClose,
    onUpdate,
    onDelete,
    isUpdating,
    isDeleting,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UpdateProductInput>({
        brand: '',
        itemNumber: '',
        name: '',
        price: 0,
        quantity: 0,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                brand: product.brand,
                itemNumber: product.itemNumber,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
            });
            setIsEditing(false);
        }
    }, [product]);

    if (!product) return null;

    const handleSave = async () => {
        await onUpdate({ id: product.id, data: formData });
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (confirm('Вы уверены, что хотите удалить эту запчасть?')) {
            await onDelete(product.id);
            onClose();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {isEditing ? 'Редактирование запчасти' : product.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 my-2">
                    {/* Изображение-заглушка */}
                    <div className="w-full h-40 bg-muted rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="w-10 h-10 mb-1 stroke-1" />
                        <span className="text-xs font-mono">{formData.itemNumber}</span>
                    </div>

                    {isEditing ? (
                        <div className="grid gap-3">
                            <div>
                                <Label htmlFor="brand">Бренд</Label>
                                <Input
                                    id="brand"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="itemNumber">Артикул</Label>
                                <Input
                                    id="itemNumber"
                                    value={formData.itemNumber}
                                    onChange={(e) => setFormData({ ...formData, itemNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="name">Наименование</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="price">Цена (₽)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="quantity">Количество</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Бренд:</span>
                                <span className="font-semibold">{product.brand}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Артикул:</span>
                                <span className="font-mono">{product.itemNumber}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-muted-foreground">Остаток на складе:</span>
                                <span>{product.quantity} шт.</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-muted-foreground">Цена:</span>
                                <span className="text-2xl font-bold text-primary">
                                    {product.price.toLocaleString('ru-RU')} ₽
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-between sm:justify-between gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                <X className="w-4 h-4 mr-1" /> Отмена
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isUpdating}
                            >
                                <Save className="w-4 h-4 mr-1" /> {isUpdating ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                <Trash2 className="w-4 h-4 mr-1" /> {isDeleting ? 'Удаление...' : 'Удалить'}
                            </Button>
                            <Button onClick={() => setIsEditing(true)}>
                                <Edit3 className="w-4 h-4 mr-1" /> Редактировать
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
