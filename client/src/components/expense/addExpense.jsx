import { LoadingButton } from '@mui/lab';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Box, Button, Chip, Container, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Select, TextField, Typography, Divider } from '@mui/material'
import { Form, FormikProvider, useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import useResponsive from '../../theme/hooks/useResponsive';
import { currencyFind } from '../../utils/helper';
import { addExpenseService } from '../../services/expenseServices';
import configData from '../../config.json'
import { useParams } from 'react-router-dom'
import { getGroupDetailsService } from '../../services/groupServices';
import Loading from '../loading';
import { Link as RouterLink } from 'react-router-dom';
import AlertBanner from '../AlertBanner';

export default function AddExpense() {  
  const params = useParams();
  const mdUp = useResponsive('up', 'md');
  const profile = JSON.parse(localStorage.getItem('profile'))
  const currentUser = profile?.emailId
  const groupId = params.groupId
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [groupMembers, setGroupMembers] = useState([])
  const [groupCurrency, setGroupCurrency] = useState()
  const [memberAmounts, setMemberAmounts] = useState({})
  const [splitEqually, setSplitEqually] = useState(true)
 
  // Formik schema 
  const addExpenseSchema = Yup.object().shape({
    expenseName: Yup.string().required('Expense name is required'),
    expenseDescription: Yup.string(),
    expenseAmount: Yup.string().required('Amount is required')
      .test('is-positive', 'Amount must be positive', value => parseFloat(value) > 0),
    expenseCategory: Yup.string().required('Category is required'),
    expenseType: Yup.string().required('Payment Method is required'),
    expenseMembers: Yup.array().min(1, 'At least one expense member is required'),
    memberAmounts: Yup.object().test(
      'amounts-match-total',
      'Sum of member amounts must equal total amount',
      function (value) {
        if (splitEqually) return true;
        const { expenseAmount } = this.parent;
        if (!expenseAmount) return true;
        
        const total = Object.values(value || {}).reduce((sum, amount) => sum + parseFloat(amount || 0), 0);
        return Math.abs(total - parseFloat(expenseAmount)) < 0.01;
      }
    )
  });

  const formik = useFormik({
    initialValues: {
      expenseName: '',
      expenseDescription: '',
      expenseAmount: '',
      expenseCategory: '',
      expenseDate: Date(),
      expenseMembers: [],
      expenseOwner: currentUser,
      groupId: groupId, 
      expenseType: "Cash",
      memberAmounts: {},
      splitType: 'equal'
    },
    validationSchema: addExpenseSchema,
    onSubmit: async (values) => {
      setLoading(true)
      // Prepare the data for submission
      const submissionData = {
        ...values,
        memberAmounts: splitEqually ? 
          {} : // Will be calculated equally on backend if empty
          memberAmounts
      };
      
      if(await addExpenseService(submissionData, setAlert, setAlertMessage)) {
        window.location = configData.VIEW_GROUP_URL+groupId
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // Handle member selection change
  const handleMemberChange = (event) => {
    const selectedMembers = event.target.value;
    setFieldValue('expenseMembers', selectedMembers);
    
    // Initialize amounts for new members
    const newAmounts = {...memberAmounts};
    selectedMembers.forEach(member => {
      if (!newAmounts[member]) {
        newAmounts[member] = splitEqually ? 
          (values.expenseAmount / selectedMembers.length).toFixed(2) : 
          '0.00';
      }
    });
    
    // Remove amounts for deselected members
    Object.keys(newAmounts).forEach(member => {
      if (!selectedMembers.includes(member)) {
        delete newAmounts[member];
      }
    });
    
    setMemberAmounts(newAmounts);
    setFieldValue('memberAmounts', newAmounts);
  };

  // Handle amount change for a specific member
  const handleMemberAmountChange = (member, amount) => {
    const newAmounts = {...memberAmounts, [member]: amount};
    setMemberAmounts(newAmounts);
    setFieldValue('memberAmounts', newAmounts);
  };

  // Handle total amount change
  const handleTotalAmountChange = (e) => {
    const amount = e.target.value;
    setFieldValue('expenseAmount', amount);
    
    if (splitEqually && values.expenseMembers.length > 0) {
      const perPersonAmount = (amount / values.expenseMembers.length).toFixed(2);
      const newAmounts = {};
      values.expenseMembers.forEach(member => {
        newAmounts[member] = perPersonAmount;
      });
      setMemberAmounts(newAmounts);
      setFieldValue('memberAmounts', newAmounts);
    }
  };

  // Toggle between equal and custom split
  const toggleSplitType = () => {
    const newSplitEqually = !splitEqually;
    setSplitEqually(newSplitEqually);
    
    if (newSplitEqually && values.expenseAmount && values.expenseMembers.length > 0) {
      const perPersonAmount = (values.expenseAmount / values.expenseMembers.length).toFixed(2);
      const newAmounts = {};
      values.expenseMembers.forEach(member => {
        newAmounts[member] = perPersonAmount;
      });
      setMemberAmounts(newAmounts);
      setFieldValue('memberAmounts', newAmounts);
    }
  };

  useEffect(() => {
    const getGroupDetails = async () => {
      setLoading(true)
      const groupIdJson = {
        id: params.groupId
      }
      const response_group = await getGroupDetailsService(groupIdJson, setAlert, setAlertMessage)
      setGroupCurrency(response_group?.data?.group?.groupCurrency)
      setGroupMembers(response_group?.data?.group?.groupMembers)
      // Initialize with all members selected by default
      setFieldValue('expenseMembers', response_group?.data?.group?.groupMembers);
      setLoading(false)
    }
    getGroupDetails()
  }, []);

  return (
    <>
      {loading ? <Loading/> : 
        <Box sx={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          ...(mdUp && { width: 700 })
        }}
        >
          <AlertBanner showAlert={alert} alertMessage={alertMessage} severity='error' />
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Add Expense
          </Typography>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3} sx={{ maxWidth: 800 }}>
                <Grid item xs={12} >
                  <TextField fullWidth
                    type="text"
                    name="expenseName"
                    id="outlined-basic"
                    label="Expense Name"
                    variant="outlined"
                    {...getFieldProps('expenseName')}
                    error={Boolean(touched.expenseName && errors.expenseName)}
                    helperText={touched.expenseName && errors.expenseName}
                  />
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    multiline
                    rows={2}
                    fullWidth
                    name="expenseDescription"
                    id="outlined-basic"
                    label="Expense Description"
                    variant="outlined"
                    {...getFieldProps('expenseDescription')}
                    error={Boolean(touched.expenseDescription && errors.expenseDescription)}
                    helperText={touched.expenseDescription && errors.expenseDescription}
                  />
                </Grid>

                <Grid item xs={12} >
                  <FormControl fullWidth
                    error={Boolean(touched.expenseOwner && errors.expenseOwner)}
                  >
                    <InputLabel id="expense-owner">Expense Owner</InputLabel>
                    <Select
                      name='expenseOwner'
                      labelId="expense-owner"
                      id="demo-simple-select"
                      label="Expense Owner"
                      {...getFieldProps('expenseOwner')}
                    >
                      {groupMembers?.map((member) => (
                        <MenuItem
                          key={member}
                          value={member}
                        >
                          {member}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{touched.expenseOwner && errors.expenseOwner}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl sx={{ width: '100%' }} error={Boolean(touched.expenseMembers && errors.expenseMembers)}>
                    <InputLabel id="expense-members-label">Expense Members</InputLabel>
                    <Select
                      labelId="expense-members-label"
                      id="expense-members"
                      multiple
                      value={values.expenseMembers}
                      onChange={handleMemberChange}
                      input={<OutlinedInput id="expense-members" label="Expense Members" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}>
                      {groupMembers?.map((member) => (
                        <MenuItem
                          key={member}
                          value={member}
                        >
                          {member}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{touched.expenseMembers && errors.expenseMembers}</FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={6} >
                  <TextField
                    fullWidth
                    name="expenseAmount"
                    id="outlined-basic"
                    type="number"
                    label="Expense Amount"
                    variant="outlined"
                    value={values.expenseAmount}
                    onChange={handleTotalAmountChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {currencyFind(groupCurrency)}
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(touched.expenseAmount && errors.expenseAmount)}
                    helperText={touched.expenseAmount && errors.expenseAmount}
                  />
                </Grid>
                <Grid item xs={6} >
                  <FormControl fullWidth
                    error={Boolean(touched.expenseCategory && errors.expenseCategory)}
                  >
                    <InputLabel id="expense-category">Expense Category</InputLabel>
                    <Select
                      name='expenseCategory'
                      labelId="expense-category"
                      id="demo-simple-select"
                      label="Expense Category"
                      {...getFieldProps('expenseCategory')}
                    >
                      <MenuItem value={'Food & drink'}>Food & drink</MenuItem>
                      <MenuItem value={'Shopping'}>Shopping</MenuItem>
                      <MenuItem value={'Entertainment'}>Entertainment</MenuItem>
                      <MenuItem value={'Home'}>Home</MenuItem>
                      <MenuItem value={'Transportation'}>Transportation</MenuItem>
                      <MenuItem value={'Others'}>Others</MenuItem>
                    </Select>
                    <FormHelperText>{touched.expenseCategory && errors.expenseCategory}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} >
                  <FormControl fullWidth
                    error={Boolean(touched.expenseType && errors.expenseType)}
                  >
                    <InputLabel id="expense-type">Payment Method</InputLabel>
                    <Select
                      name='expenseType'
                      labelId="expense-type"
                      id="demo-simple-select"
                      label="Payment Method"
                      {...getFieldProps('expenseType')}
                    >
                      <MenuItem value={'Cash'}>Cash</MenuItem>
                      <MenuItem value={'UPI Payment'}>UPI Payment</MenuItem>
                      <MenuItem value={'Card'}>Card</MenuItem>
                    </Select>
                    <FormHelperText>{touched.expenseType && errors.expenseType}</FormHelperText>
                  </FormControl>
                </Grid>
                
                {/* Split Type Toggle */}
                <Grid item xs={12}>
                  <Button 
                    variant={splitEqually ? "contained" : "outlined"} 
                    onClick={toggleSplitType}
                    fullWidth
                  >
                    {splitEqually ? 'Split Equally' : 'Split Custom Amounts'}
                  </Button>
                </Grid>
                
                {/* Member Amounts Section */}
                {values.expenseMembers.length > 0 && !splitEqually && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Enter amounts for each member:
                    </Typography>
                    <Box sx={{ 
                      maxHeight: '200px', 
                      overflowY: 'auto',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      p: 2
                    }}>
                      {values.expenseMembers.map((member) => (
                        <Box key={member} sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>{member}</Typography>
                          <TextField
                            fullWidth
                            type="number"
                            label="Amount"
                            variant="outlined"
                            value={memberAmounts[member] || '0.00'}
                            onChange={(e) => handleMemberAmountChange(member, e.target.value)}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {currencyFind(groupCurrency)}
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      ))}
                      {errors.memberAmounts && (
                        <FormHelperText error>{errors.memberAmounts}</FormHelperText>
                      )}
                    </Box>
                  </Grid>
                )}
                
                {/* Summary of Split */}
                {values.expenseMembers.length > 0 && values.expenseAmount && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Split Summary:
                    </Typography>
                    <Box sx={{ 
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      p: 2
                    }}>
                      {values.expenseMembers.map((member) => (
                        <Box key={member} sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          mb: 1
                        }}>
                          <Typography variant="body2">{member}</Typography>
                          <Typography variant="body2">
                            {currencyFind(groupCurrency)}{memberAmounts[member] || 
                              (values.expenseAmount / values.expenseMembers.length).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontWeight: 'bold'
                      }}>
                        <Typography variant="body1">Total</Typography>
                        <Typography variant="body1">
                          {currencyFind(groupCurrency)}{values.expenseAmount}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {mdUp ? 
                    <DesktopDatePicker
                      name="expenseDate"
                      label="Expense Date"
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} sx={{width: '100%'}} />}
                      value={formik.values.expenseDate}
                      onChange={(value) => {
                        formik.setFieldValue('expenseDate', Date.parse(value));
                      }}
                    />
                    :
                    <MobileDatePicker
                      name="expenseDate"
                      label="Expense Date"
                      inputFormat="dd/MM/yyyy"
                      renderInput={(params) => <TextField {...params} sx={{width: '100%'}} />}
                      value={formik.values.expenseDate}
                      onChange={(value) => {
                        formik.setFieldValue('expenseDate', Date.parse(value));
                      }}
                    />}
                  </LocalizationProvider>
                </Grid>

                {mdUp && <Grid item xs={0} md={6} />}
                <Grid item xs={6} md={3}>
                  <Button fullWidth size="large" variant="outlined" component={RouterLink} to={configData.VIEW_GROUP_URL+groupId}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
                    Add Expense
                  </LoadingButton>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Box>
      }
    </>                  
  )
}