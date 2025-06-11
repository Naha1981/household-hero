import React, { useState } from 'react';
import SectionContainer from '../components/SectionContainer';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { StockItem } from '../types';
import Icon from '../components/icons/IconMap'; // Assuming IconMap is in components/icons

interface HouseholdScreenProps {
  stockItems: StockItem[];
  setStockItems: React.Dispatch<React.SetStateAction<StockItem[]>>;
}

const HouseholdScreen: React.FC<HouseholdScreenProps> = ({ stockItems, setStockItems }) => {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState<string>('');

  const openAddItemModal = (itemToEdit?: StockItem) => {
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setItemName(itemToEdit.name);
      setQuantity(itemToEdit.quantity.toString());
      setUnit(itemToEdit.unit);
      setLowStockThreshold(itemToEdit.lowStockThreshold?.toString() || '');
    } else {
      setEditingItem(null);
      setItemName('');
      setQuantity('');
      setUnit('');
      setLowStockThreshold('');
    }
    setIsAddItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!itemName || !quantity || !unit) {
      alert("Please fill name, quantity, and unit.");
      return;
    }
    const currentItemQuantity = parseFloat(quantity);
    const currentItemData: Omit<StockItem, 'id' | 'lastUpdated'> = {
      name: itemName,
      quantity: currentItemQuantity,
      unit: unit,
      lowStockThreshold: lowStockThreshold ? parseFloat(lowStockThreshold) : undefined,
    };

    const nowISO = new Date().toISOString();

    if (editingItem) {
      setStockItems(prevItems => 
        prevItems.map(item => {
          if (item.id === editingItem.id) {
            const updatedItem = { ...item, ...currentItemData, lastUpdated: nowISO };
            // If quantity increased from 0 or was 0 and now is > 0, consider it restocked
            if (currentItemQuantity > 0 && item.quantity <= 0) {
              updatedItem.lastRestockedDate = nowISO;
              updatedItem.lastUsedUpDate = undefined; // Clear used up date on restock
            }
            return updatedItem;
          }
          return item;
        })
      );
    } else {
      const newItem: StockItem = {
        id: Date.now().toString(),
        ...currentItemData,
        lastUpdated: nowISO,
      };
      if (newItem.quantity > 0) {
        newItem.lastRestockedDate = nowISO; // Set restock date for new items with quantity
      }
      setStockItems(prevItems => [newItem, ...prevItems]);
    }
    setIsAddItemModalOpen(false);
  };

  const updateItemQuantity = (itemId: string, change: number) => {
    const nowISO = new Date().toISOString();
    setStockItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          const updatedItem = { ...item, quantity: newQuantity, lastUpdated: nowISO };

          if (change > 0 && newQuantity > item.quantity) { // Quantity increased
            updatedItem.lastRestockedDate = nowISO;
            updatedItem.lastUsedUpDate = undefined; // Clear used up date on restock
          }
          // If quantity becomes 0 through +/- buttons, it's just 0, not explicitly "used up" for learning.
          // The "Used Up" button handles the learning part.
          return updatedItem;
        }
        return item;
      })
    );
  };
  
  const handleUsedUp = (itemId: string) => {
    const nowISO = new Date().toISOString();
    setStockItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          let newEstimatedConsumptionDays = item.estimatedConsumptionDays;
          if (item.lastRestockedDate) {
            const restockDate = new Date(item.lastRestockedDate);
            const usedUpDate = new Date(nowISO);
            const durationMs = usedUpDate.getTime() - restockDate.getTime();
            const durationDays = durationMs / (1000 * 60 * 60 * 24);

            if (durationDays > 0.1) { // Only learn if duration is somewhat meaningful (e.g., > 0.1 days)
              if (item.estimatedConsumptionDays) {
                // Simple moving average: new_avg = old_avg * 0.7 + new_val * 0.3 (giving more weight to recent)
                 newEstimatedConsumptionDays = Math.round(((item.estimatedConsumptionDays * 0.7) + (durationDays * 0.3)) * 10) / 10;
              } else {
                newEstimatedConsumptionDays = Math.round(durationDays * 10) / 10;
              }
            }
          }
          return { 
            ...item, 
            quantity: 0, 
            lastUsedUpDate: nowISO, 
            lastUpdated: nowISO, 
            estimatedConsumptionDays: newEstimatedConsumptionDays,
            // lastRestockedDate remains to show the start of the cycle that just ended
            // It will be updated on the *next* restock (quantity increase)
          };
        }
        return item;
      })
    );
  };

  const removeItem = (itemId: string) => {
    setStockItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const lowStockItems = stockItems.filter(item => item.lowStockThreshold && item.quantity <= item.lowStockThreshold && item.quantity > 0);
  
  const getItemStatus = (item: StockItem): React.ReactNode => {
    if (item.quantity > 0 && item.lowStockThreshold && item.quantity <= item.lowStockThreshold) {
      return <span className="text-amber-600 font-semibold">Low Stock!</span>;
    }
    if (item.quantity === 0 && item.lastUsedUpDate) {
        return <span className="text-red-500 font-semibold">Used Up (Restock)</span>;
    }
    if (item.quantity === 0 && !item.lastUsedUpDate) {
        return <span className="text-slate-500">Empty</span>;
    }
    if (item.lastRestockedDate && item.estimatedConsumptionDays && item.estimatedConsumptionDays > 0) {
      const today = new Date();
      const restockDate = new Date(item.lastRestockedDate);
      const daysSinceRestock = (today.getTime() - restockDate.getTime()) / (1000 * 60 * 60 * 24);
      const daysRemaining = item.estimatedConsumptionDays - daysSinceRestock;

      if (daysRemaining <= 0) {
        return <span className="text-orange-500">Est. Empty (Overdue)</span>;
      }
      if (daysRemaining <= Math.min(2, item.estimatedConsumptionDays / 3)) { // Highlight if less than 2 days or 1/3 of cycle
          return <span className="text-yellow-600">Est. ~{Math.ceil(daysRemaining)} day(s)</span>;
      }
      return `Est. ~${Math.ceil(daysRemaining)} days`;
    }
    return <span className="text-slate-400 italic">Track usage</span>;
  };


  return (
    <SectionContainer title="Household Stock Tracking">
      <div className="mb-6">
        <Button onClick={() => openAddItemModal()}>Add New Stock Item</Button>
      </div>

      {lowStockItems.length > 0 && (
        <Card title="Low Stock Alerts!" className="mb-6 bg-amber-50 border-amber-400 text-amber-800" titleClassName="text-amber-700">
           <div className="flex items-center mb-2">
            <Icon name="archive" className="w-6 h-6 mr-2 text-amber-600" /> {/* Placeholder, use warning icon if available */}
            <p className="font-semibold">The following items are running low:</p>
          </div>
          <ul className="list-disc list-inside text-amber-700 pl-5">
            {lowStockItems.map(item => (
              <li key={item.id}>{item.name} (Current: {item.quantity} {item.unit}, Threshold: {item.lowStockThreshold} {item.unit})</li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="Current Stock">
        {stockItems.length === 0 ? (
          <p className="text-slate-600">No stock items tracked yet. Add some!</p>
        ) : (
          <div className="overflow-x-auto shadow border-b border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Item Name</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Unit</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Low At</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider whitespace-nowrap">AI Est. Empty / Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {stockItems.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} hover:bg-primary/5 transition-colors`}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{item.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Button size="sm" variant="ghost" onClick={() => updateItemQuantity(item.id, -1)} className="p-1 text-primary hover:bg-primary/10 disabled:opacity-50" disabled={item.quantity === 0}>-</Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button size="sm" variant="ghost" onClick={() => updateItemQuantity(item.id, 1)} className="p-1 text-primary hover:bg-primary/10">+</Button>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-slate-600">{item.unit}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">{item.lowStockThreshold || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">{getItemStatus(item)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => openAddItemModal(item)} className="text-primary hover:bg-primary/10">Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleUsedUp(item.id)} className="text-indigo-600 hover:bg-indigo-100 disabled:opacity-50" disabled={item.quantity === 0}>Used Up</Button>
                      <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)} className="text-error hover:bg-error/10">Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      <Card title="Consumption Insights & Tracking (Beta)" className="mt-6">
        <p className="text-slate-600 text-sm mb-2">
            Help the AI learn your household's consumption patterns!
        </p>
        <ul className="list-disc list-inside text-slate-500 text-sm space-y-1">
            <li>When you finish an item, click the <strong className="text-indigo-600">"Used Up"</strong> button for it. This helps record how long it lasted.</li>
            <li>When you restock, adjust the quantity using the <strong>+/-</strong> buttons or by <strong>editing</strong> the item. This logs the restock date.</li>
            <li>The "AI Est. Empty / Status" column will provide smarter estimates over time as it learns.</li>
        </ul>
         <p className="text-xs text-slate-400 mt-3 italic">
            For now, the "Low Stock At" threshold you set is the primary alert. More advanced AI-driven predictive reminders are planned for future updates.
        </p>
      </Card>

      <Modal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} title={editingItem ? "Edit Stock Item" : "Add New Stock Item"}>
        <div className="space-y-4">
          <Input label="Item Name" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g., Rice" required />
          <Input label="Quantity" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g., 2" required min="0" />
          <Input label="Unit" value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g., kg, bags, items" required />
          <Input label="Low Stock Threshold (Optional)" type="number" value={lowStockThreshold} onChange={e => setLowStockThreshold(e.target.value)} placeholder="e.g., 0.5 (for 0.5 kg)" min="0" />
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setIsAddItemModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItem}>{editingItem ? "Save Changes" : "Add Item"}</Button>
          </div>
        </div>
      </Modal>
    </SectionContainer>
  );
};

export default HouseholdScreen;