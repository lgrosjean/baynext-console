"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Upload, Database, Settings, CheckCircle, AlertCircle, X } from 'lucide-react';

// Schema definition
const datasetSchema = z.object({
  name: z.string().min(1, "Dataset name is required"),
  description: z.string().optional(),
  kpiType: z.enum(['revenue', 'non-revenue']),
  
  // Column mappings
  geo: z.string().optional(),
  time: z.string().min(1, "Time column is required"),
  kpi: z.string().min(1, "KPI column is required"),
  revenuePerKpi: z.string().optional(),
  population: z.string().optional(),
  controls: z.array(z.string()).default([]),
  
  // Media configuration
  mediaType: z.enum(['impression', 'reach-frequency']),
  
  // Impression-based media
  mediaColumns: z.array(z.object({
    column: z.string(),
    channel: z.string(),
  })).default([]),
  mediaSpendColumns: z.array(z.object({
    column: z.string(),
    channel: z.string(),
  })).default([]),
  
  // Reach & Frequency media
  reachColumns: z.array(z.object({
    column: z.string(),
    channel: z.string(),
  })).default([]),
  frequencyColumns: z.array(z.object({
    column: z.string(),
    channel: z.string(),
  })).default([]),
  rfSpendColumns: z.array(z.object({
    column: z.string(),
    channel: z.string(),
  })).default([]),
  
  // Optional data
  nonMediaTreatments: z.array(z.string()).default([]),
  organicMedia: z.array(z.object({
    column: z.string(),
    channel: z.string(),
  })).default([]),
  organicReach: z.array(z.object({
    column: z.string(),
    channel: z.string(),
  })).default([]),
  organicFrequency: z.array(z.object({
    column: z.string(),
    channel: z.string(),
  })).default([]),
});

// Mock CSV columns for demo
const mockColumns = [
  'date', 'dma', 'conversions', 'revenue_per_conversion', 'population',
  'income_control', 'seasonality_control', 
  'tv_impressions', 'fb_impressions', 'search_impressions',
  'tv_spend', 'fb_spend', 'search_spend',
  'yt_reach', 'yt_frequency', 'yt_rf_spend',
  'price_discount', 'promotion',
  'organic_blog', 'newsletter_reach', 'newsletter_frequency'
];

const MeridianDatasetCreator = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basics');
  const [csvData, setCsvData] = useState(null);
  
  const form = useForm({
    resolver: zodResolver(datasetSchema),
    defaultValues: {
      name: '',
      description: '',
      kpiType: 'non-revenue',
      mediaType: 'impression',
      controls: [],
      mediaColumns: [],
      mediaSpendColumns: [],
      reachColumns: [],
      frequencyColumns: [],
      rfSpendColumns: [],
      nonMediaTreatments: [],
      organicMedia: [],
      organicReach: [],
      organicFrequency: [],
    },
  });

  const { watch, setValue } = form;
  const watchedValues = watch();

  // Component for adding channel mappings
  const ChannelMappingTable = ({ 
    title, 
    fieldName, 
    description,
    existingChannels = [] 
  }) => {
    const mappings = watch(fieldName) || [];
    
    const addMapping = () => {
      setValue(fieldName, [...mappings, { column: '', channel: '' }]);
    };
    
    const removeMapping = (index) => {
      setValue(fieldName, mappings.filter((_, i) => i !== index));
    };
    
    const updateMapping = (index, field, value) => {
      const updated = [...mappings];
      updated[index] = { ...updated[index], [field]: value };
      setValue(fieldName, updated);
    };

    return (
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-cyan-300 mb-1">{title}</h4>
          {description && (
            <p className="text-sm text-gray-400 mb-3">{description}</p>
          )}
        </div>
        
        {mappings.map((mapping, index) => (
          <div key={index} className="flex gap-3 items-end p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
            <div className="flex-1">
              <Label className="text-xs text-gray-300">Column</Label>
              <Select 
                value={mapping.column} 
                onValueChange={(value) => updateMapping(index, 'column', value)}
              >
                <SelectTrigger className="bg-black/20 border-cyan-500/30">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-cyan-500/30">
                  {mockColumns.map((col) => (
                    <SelectItem key={col} value={col} className="text-gray-100 hover:bg-cyan-500/20">
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Label className="text-xs text-gray-300">Channel Name</Label>
              <Input
                value={mapping.channel}
                onChange={(e) => updateMapping(index, 'channel', e.target.value)}
                placeholder="e.g., tv, facebook, google"
                className="bg-black/20 border-cyan-500/30 focus:border-cyan-400"
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeMapping(index)}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addMapping}
          className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Mapping
        </Button>
      </div>
    );
  };

  const onSubmit = (data) => {
    console.log('Dataset Configuration:', data);
    // Here you would send the data to your backend
    setOpen(false);
  };

  return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold px-8 py-4 text-lg shadow-lg shadow-cyan-500/25"
              >
                <Database className="h-5 w-5 mr-2" />
                Create New Dataset
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-cyan-500/30 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Configure Meridian MMM Dataset
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 border border-cyan-500/20">
                      <TabsTrigger 
                        value="basics" 
                        className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                      >
                        Basics
                      </TabsTrigger>
                      <TabsTrigger 
                        value="columns" 
                        className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                      >
                        Columns
                      </TabsTrigger>
                      <TabsTrigger 
                        value="media" 
                        className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                      >
                        Media
                      </TabsTrigger>
                      <TabsTrigger 
                        value="additional" 
                        className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                      >
                        Additional
                      </TabsTrigger>
                      <TabsTrigger 
                        value="review" 
                        className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                      >
                        Review
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basics" className="space-y-6 mt-6">
                      <Card className="bg-gray-800/30 border-cyan-500/20">
                        <CardHeader>
                          <CardTitle className="text-cyan-300 flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Dataset Information
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Basic information about your MMM dataset
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-cyan-300">Dataset Name *</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="My MMM Dataset Q4 2024"
                                    {...field} 
                                    className="bg-black/20 border-cyan-500/30 focus:border-cyan-400 text-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-cyan-300">Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Optional description of your dataset..."
                                    {...field} 
                                    className="bg-black/20 border-cyan-500/30 focus:border-cyan-400 text-white min-h-[80px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="kpiType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-cyan-300">KPI Type *</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex gap-6"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="revenue" id="revenue" className="border-cyan-500 text-cyan-400" />
                                      <Label htmlFor="revenue" className="text-gray-300">Revenue</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="non-revenue" id="non-revenue" className="border-cyan-500 text-cyan-400" />
                                      <Label htmlFor="non-revenue" className="text-gray-300">Non-Revenue (Conversions)</Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormDescription className="text-gray-400 text-xs">
                                  Choose whether your KPI represents direct revenue or conversion events
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>

                      <Card className="bg-gray-800/30 border-cyan-500/20">
                        <CardHeader>
                          <CardTitle className="text-cyan-300 flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Data Upload
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Upload your CSV or Excel file containing the marketing data
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="border-2 border-dashed border-cyan-500/30 rounded-lg p-8 text-center hover:border-cyan-500/50 transition-colors">
                            <Upload className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
                            <p className="text-lg mb-2 text-gray-300">Drop your file here or click to browse</p>
                            <p className="text-sm text-gray-500">Supports CSV</p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              className="mt-4 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                            >
                              Choose File
                            </Button>
                          </div>
                          {csvData && (
                            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                              <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle className="h-4 w-4" />
                                <span>File uploaded successfully</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="columns" className="space-y-6 mt-6">
                      <Card className="bg-gray-800/30 border-cyan-500/20">
                        <CardHeader>
                          <CardTitle className="text-cyan-300">Column Mappings</CardTitle>
                          <CardDescription className="text-gray-400">
                            Map your CSV columns to the required Meridian data structure
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="geo"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-cyan-300">Geographic Dimension</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-black/20 border-cyan-500/30">
                                        <SelectValue placeholder="Select geo column" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-900 border-cyan-500/30">
                                      {mockColumns.map((col) => (
                                        <SelectItem key={col} value={col} className="text-gray-100 hover:bg-cyan-500/20">
                                          {col}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription className="text-gray-400">
                                    Optional for national models
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="time"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-cyan-300">Time Column *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-black/20 border-cyan-500/30">
                                        <SelectValue placeholder="Select time column" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-900 border-cyan-500/30">
                                      {mockColumns.map((col) => (
                                        <SelectItem key={col} value={col} className="text-gray-100 hover:bg-cyan-500/20">
                                          {col}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription className="text-gray-400">
                                    Must be in YYYY-MM-DD format
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="kpi"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-cyan-300">KPI Column *</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-black/20 border-cyan-500/30">
                                        <SelectValue placeholder="Select KPI column" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-900 border-cyan-500/30">
                                      {mockColumns.map((col) => (
                                        <SelectItem key={col} value={col} className="text-gray-100 hover:bg-cyan-500/20">
                                          {col}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {watchedValues.kpiType === 'revenue' && (
                              <FormField
                                control={form.control}
                                name="revenuePerKpi"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-cyan-300">Revenue per KPI</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-black/20 border-cyan-500/30">
                                          <SelectValue placeholder="Select revenue per KPI column" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-gray-900 border-cyan-500/30">
                                        {mockColumns.map((col) => (
                                          <SelectItem key={col} value={col} className="text-gray-100 hover:bg-cyan-500/20">
                                            {col}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            <FormField
                              control={form.control}
                              name="population"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-cyan-300">Population</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-black/20 border-cyan-500/30">
                                        <SelectValue placeholder="Select population column" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-900 border-cyan-500/30">
                                      {mockColumns.map((col) => (
                                        <SelectItem key={col} value={col} className="text-gray-100 hover:bg-cyan-500/20">
                                          {col}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormDescription className="text-gray-400">
                                    Optional, defaults to 1.0 for national models
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Separator className="bg-cyan-500/20" />

                          <div>
                            <Label className="text-cyan-300 text-base mb-3 block">Control Variables</Label>
                            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-cyan-500/20 rounded-lg bg-black/10">
                              {mockColumns.map((col) => (
                                <div key={col} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`control-${col}`}
                                    className="rounded border-cyan-500/30 bg-black/20 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                                    onChange={(e) => {
                                      const controls = watchedValues.controls || [];
                                      if (e.target.checked) {
                                        setValue('controls', [...controls, col]);
                                      } else {
                                        setValue('controls', controls.filter(c => c !== col));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`control-${col}`} className="text-sm text-gray-300 cursor-pointer">
                                    {col}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                              Select columns that represent control variables (e.g., seasonality, economic indicators)
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="media" className="space-y-6 mt-6">
                      <Card className="bg-gray-800/30 border-cyan-500/20">
                        <CardHeader>
                          <CardTitle className="text-cyan-300">Media Configuration</CardTitle>
                          <CardDescription className="text-gray-400">
                            Configure your media data format - choose between impression-based or reach & frequency
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <FormField
                            control={form.control}
                            name="mediaType"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-2 gap-4"
                                  >
                                    <div className="flex items-center space-x-2 p-4 border border-cyan-500/30 rounded-lg bg-cyan-500/5">
                                      <RadioGroupItem value="impression" id="impression" className="border-cyan-500 text-cyan-400" />
                                      <Label htmlFor="impression" className="text-gray-300 font-medium">
                                        Impression-based Media
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 p-4 border border-cyan-500/30 rounded-lg bg-cyan-500/5">
                                      <RadioGroupItem value="reach-frequency" id="reach-frequency" className="border-cyan-500 text-cyan-400" />
                                      <Label htmlFor="reach-frequency" className="text-gray-300 font-medium">
                                        Reach & Frequency
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {watchedValues.mediaType === 'impression' && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <ChannelMappingTable
                                  title="Media Impressions"
                                  fieldName="mediaColumns"
                                  description="Map impression columns to channel names"
                                />
                                
                                <ChannelMappingTable
                                  title="Media Spend"
                                  fieldName="mediaSpendColumns"
                                  description="Map spend columns to channel names"
                                />
                              </div>
                              
                              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h4 className="text-blue-400 font-medium mb-1">Important Notes</h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                      <li>• Each channel must appear in exactly one section (impressions OR reach & frequency)</li>
                                      <li>• Channel names must match between impressions and spend mappings</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {watchedValues.mediaType === 'reach-frequency' && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-3 gap-4">
                                <ChannelMappingTable
                                  title="Reach"
                                  fieldName="reachColumns"
                                  description="Map reach columns to channels"
                                />
                                
                                <ChannelMappingTable
                                  title="Frequency"
                                  fieldName="frequencyColumns"
                                  description="Map frequency columns to channels"
                                />
                                
                                <ChannelMappingTable
                                  title="R&F Spend"
                                  fieldName="rfSpendColumns"
                                  description="Map R&F spend columns to channels"
                                />
                              </div>
                              
                              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <h4 className="text-purple-400 font-medium mb-1">Reach & Frequency Requirements</h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                      <li>• All three mappings (reach, frequency, spend) are required</li>
                                      <li>• Channel names must match across all three sections</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="additional" className="space-y-6 mt-6">
                      <Card className="bg-gray-800/30 border-cyan-500/20">
                        <CardHeader>
                          <CardTitle className="text-cyan-300">Additional Data (Optional)</CardTitle>
                          <CardDescription className="text-gray-400">
                            Configure optional data sources for enhanced modeling
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <Label className="text-cyan-300 text-base mb-3 block">Non-Media Treatments</Label>
                            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-cyan-500/20 rounded-lg bg-black/10">
                              {mockColumns.map((col) => (
                                <div key={col} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`treatment-${col}`}
                                    className="rounded border-cyan-500/30 bg-black/20 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                                    onChange={(e) => {
                                      const treatments = watchedValues.nonMediaTreatments || [];
                                      if (e.target.checked) {
                                        setValue('nonMediaTreatments', [...treatments, col]);
                                      } else {
                                        setValue('nonMediaTreatments', treatments.filter(t => t !== col));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`treatment-${col}`} className="text-sm text-gray-300 cursor-pointer">
                                    {col}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                              Select columns for non-media treatments (e.g., price changes, promotions, discounts)
                            </p>
                          </div>

                          <Separator className="bg-cyan-500/20" />

                          <div className="grid grid-cols-3 gap-6">
                            <ChannelMappingTable
                              title="Organic Media"
                              fieldName="organicMedia"
                              description="Map organic media columns to channels (e.g., blog posts, PR)"
                            />
                            
                            <ChannelMappingTable
                              title="Organic Reach"
                              fieldName="organicReach"
                              description="Map organic reach columns to channels"
                            />
                            
                            <ChannelMappingTable
                              title="Organic Frequency"
                              fieldName="organicFrequency"
                              description="Map organic frequency columns to channels"
                            />
                          </div>

                          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="text-green-400 font-medium mb-1">Organic Data Notes</h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                  <li>• Organic reach and frequency must be mapped together if provided</li>
                                  <li>• Channel names should match between organic reach and frequency</li>
                                  <li>• These fields are completely optional for basic MMM analysis</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="review" className="space-y-6 mt-6">
                      <Card className="bg-gray-800/30 border-cyan-500/20">
                        <CardHeader>
                          <CardTitle className="text-cyan-300 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Configuration Review
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            Review your dataset configuration before creating
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Basic Info Summary */}
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="text-cyan-300 font-medium">Dataset Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Name:</span>
                                  <span className="text-white">{watchedValues.name || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">KPI Type:</span>
                                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                                    {watchedValues.kpiType}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Media Type:</span>
                                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                                    {watchedValues.mediaType}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-cyan-300 font-medium">Column Mappings</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Time:</span>
                                  <span className="text-white">{watchedValues.time || 'Not mapped'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">KPI:</span>
                                  <span className="text-white">{watchedValues.kpi || 'Not mapped'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Geographic:</span>
                                  <span className="text-white">{watchedValues.geo || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Controls:</span>
                                  <span className="text-white">{watchedValues.controls?.length || 0} selected</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator className="bg-cyan-500/20" />

                          {/* Media Configuration Summary */}
                          <div>
                            <h4 className="text-cyan-300 font-medium mb-3">Media Configuration</h4>
                            {watchedValues.mediaType === 'impression' ? (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                  <h5 className="text-blue-400 font-medium mb-2">Media Impressions</h5>
                                  <div className="space-y-1">
                                    {watchedValues.mediaColumns?.map((mapping, index) => (
                                      <div key={index} className="text-sm flex justify-between">
                                        <span className="text-gray-400">{mapping.column}</span>
                                        <span className="text-white">→ {mapping.channel}</span>
                                      </div>
                                    )) || <span className="text-gray-500 text-sm">No mappings configured</span>}
                                  </div>
                                </div>
                                
                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                  <h5 className="text-green-400 font-medium mb-2">Media Spend</h5>
                                  <div className="space-y-1">
                                    {watchedValues.mediaSpendColumns?.map((mapping, index) => (
                                      <div key={index} className="text-sm flex justify-between">
                                        <span className="text-gray-400">{mapping.column}</span>
                                        <span className="text-white">→ {mapping.channel}</span>
                                      </div>
                                    )) || <span className="text-gray-500 text-sm">No mappings configured</span>}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                  <h5 className="text-purple-400 font-medium mb-2">Reach</h5>
                                  <div className="space-y-1">
                                    {watchedValues.reachColumns?.map((mapping, index) => (
                                      <div key={index} className="text-sm flex justify-between">
                                        <span className="text-gray-400">{mapping.column}</span>
                                        <span className="text-white">→ {mapping.channel}</span>
                                      </div>
                                    )) || <span className="text-gray-500 text-sm">No mappings</span>}
                                  </div>
                                </div>
                                
                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                  <h5 className="text-yellow-400 font-medium mb-2">Frequency</h5>
                                  <div className="space-y-1">
                                    {watchedValues.frequencyColumns?.map((mapping, index) => (
                                      <div key={index} className="text-sm flex justify-between">
                                        <span className="text-gray-400">{mapping.column}</span>
                                        <span className="text-white">→ {mapping.channel}</span>
                                      </div>
                                    )) || <span className="text-gray-500 text-sm">No mappings</span>}
                                  </div>
                                </div>
                                
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                  <h5 className="text-red-400 font-medium mb-2">R&F Spend</h5>
                                  <div className="space-y-1">
                                    {watchedValues.rfSpendColumns?.map((mapping, index) => (
                                      <div key={index} className="text-sm flex justify-between">
                                        <span className="text-gray-400">{mapping.column}</span>
                                        <span className="text-white">→ {mapping.channel}</span>
                                      </div>
                                    )) || <span className="text-gray-500 text-sm">No mappings</span>}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <Separator className="bg-cyan-500/20" />

                          {/* Additional Data Summary */}
                          <div>
                            <h4 className="text-cyan-300 font-medium mb-3">Additional Data</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-gray-300 font-medium mb-2">Non-Media Treatments</h5>
                                <div className="flex flex-wrap gap-1">
                                  {watchedValues.nonMediaTreatments?.length > 0 ? (
                                    watchedValues.nonMediaTreatments.map((treatment) => (
                                      <Badge key={treatment} variant="outline" className="border-orange-500/30 text-orange-400 text-xs">
                                        {treatment}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-gray-500 text-sm">None selected</span>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-gray-300 font-medium mb-2">Organic Data</h5>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Organic Media:</span>
                                    <span className="text-white">{watchedValues.organicMedia?.length || 0} mappings</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Organic Reach:</span>
                                    <span className="text-white">{watchedValues.organicReach?.length || 0} mappings</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Organic Frequency:</span>
                                    <span className="text-white">{watchedValues.organicFrequency?.length || 0} mappings</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator className="bg-cyan-500/20" />

                          {/* Validation Status */}
                          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="h-5 w-5 text-green-400" />
                              <h4 className="text-green-400 font-medium">Validation Status</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  <span className="text-gray-300">Required fields completed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  <span className="text-gray-300">Column mappings valid</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  <span className="text-gray-300">Media configuration complete</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  <span className="text-gray-300">No channel conflicts detected</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-6 border-t border-cyan-500/20">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                    >
                      Cancel
                    </Button>
                    
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const tabs = ['basics', 'columns', 'media', 'additional', 'review'];
                          const currentIndex = tabs.indexOf(activeTab);
                          if (currentIndex > 0) {
                            setActiveTab(tabs[currentIndex - 1]);
                          }
                        }}
                        disabled={activeTab === 'basics'}
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </Button>
                      
                      {activeTab !== 'review' ? (
                        <Button
                          type="button"
                          onClick={() => {
                            const tabs = ['basics', 'columns', 'media', 'additional', 'review'];
                            const currentIndex = tabs.indexOf(activeTab);
                            if (currentIndex < tabs.length - 1) {
                              setActiveTab(tabs[currentIndex + 1]);
                            }
                          }}
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white font-semibold px-8"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Create Dataset
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
  );
};

export default MeridianDatasetCreator;